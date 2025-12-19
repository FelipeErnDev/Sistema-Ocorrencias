import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Ocorrencia } from './ocorrencia.entity';
import { HistoricoStatus } from 'src/historico-status/historico-status.entity';
import { Status, Perfil } from 'src/common/enums';
import { StatusEntity } from 'src/status/status.entity';
import { User } from 'src/users/user.entity';
import { AuditService } from 'src/audit/audit.service';
import { Setor } from 'src/setores/setor.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class OcorrenciasService {
  constructor(
    @InjectRepository(Ocorrencia) private repo: Repository<Ocorrencia>,
    @InjectRepository(HistoricoStatus)
    private histRepo: Repository<HistoricoStatus>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(StatusEntity)
    private statusRepo: Repository<StatusEntity>,
    @InjectRepository(Setor)
    private setorRepo: Repository<Setor>,
    private audit: AuditService,
    private notifications: NotificationsService,
  ) {}

  // ✅ ADICIONADO: Método para buscar status por ID
  async getStatusById(statusId: number): Promise<StatusEntity | null> {
    return this.statusRepo.findOne({ where: { id: statusId } });
  }

  async create(
    input: {
      titulo: string;
      descricao?: string;
      gestor?: any;
      colaborador?: any;
      setor?: any;
      workflow?: any;
      status?: any; // ✅ ADICIONADO
      documentacaoUrl?: string;
      descricaoExecucao?: string;
    },
    actorId?: number,
  ) {
    const oc = this.repo.create({
      titulo: input.titulo,
      descricao: input.descricao,
      gestor: input.gestor,
      colaborador: input.colaborador,
      setor: input.setor,
      workflow: input.workflow,
      status: input.status, // ✅ ADICIONADO: Persistir status
    });

    // Persistir novos campos se existirem
    if (typeof input.documentacaoUrl === 'string')
      oc.documentacaoUrl = input.documentacaoUrl;
    if (typeof input.descricaoExecucao === 'string')
      oc.descricaoExecucao = input.descricaoExecucao;

    const saved = await this.repo.save(oc);

    // ✅ RECARREGAR com todas as relações
    const created = await this.repo.findOne({
      where: { id: saved.id },
      relations: [
        'gestor',
        'colaborador',
        'setor',
        'workflow',
        'status',
        'subtarefas',
        'historicos',
      ],
    });

    try {
      await this.audit.log(
        actorId ?? null,
        'create_ocorrencia',
        'ocorrencia',
        saved.id,
      );
    } catch (err) {
      // omit audit failure
    }
    return created;
  }

  findAll(
    titulo?: string,
    setorId?: number,
    status?: string,
    order?: string,
    workflowId?: number,
  ) {
    const qb = this.repo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.gestor', 'gestor')
      .leftJoinAndSelect('o.colaborador', 'colaborador')
      .leftJoinAndSelect('o.subtarefas', 'subtarefas')
      .leftJoinAndSelect('o.historicos', 'historicos')
      .leftJoinAndSelect('o.setor', 'setor')
      .leftJoinAndSelect('o.status', 'status')
      .leftJoinAndSelect('o.workflow', 'workflow'); // ✅ ADICIONE ISTO

    if (titulo)
      qb.andWhere('LOWER(o.titulo) LIKE :t', {
        t: `%${(titulo || '').toLowerCase()}%`,
      });
    if (setorId) qb.andWhere('setor.id = :sid', { sid: setorId });
    if (status) qb.andWhere('status.chave = :schave', { schave: status });
    if (workflowId) qb.andWhere('o.workflowId = :wfId', { wfId: workflowId });

    const sortOrder = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy('o.createdAt', sortOrder);
    return qb.getMany();
  }

  async atribuirColaborador(
    ocorrenciaId: number,
    colaboradorId: number,
    novoStatus: number | Status = Status.EM_FILA,
    actorId?: number,
  ) {
    const oc = await this.repo.findOne({ where: { id: ocorrenciaId } });
    if (!oc) throw new NotFoundException('Ocorrencia not found');
    const colaborador = await this.userRepo.findOne({
      where: { id: colaboradorId },
    });
    if (!colaborador) throw new NotFoundException('Colaborador not found');
    oc.colaborador = colaborador;
    if (typeof novoStatus === 'number') {
      const s = await this.statusRepo.findOne({ where: { id: novoStatus } });
      if (s) oc.status = s;
    } else if (typeof novoStatus === 'string') {
      const s = await this.statusRepo.findOne({
        where: { chave: novoStatus as string },
      });
      if (s) oc.status = s;
    }
    await this.repo.save(oc);
    await this.logStatus(oc, oc.status);
    try {
      await this.audit.log(
        actorId ?? null,
        'update_ocorrencia_atribuir',
        'ocorrencia',
        oc.id,
      );
    } catch (err) {
      Logger.warn(
        `Falha ao registrar auditoria de atribuição: ${
          err instanceof Error ? err.message : String(err)
        }`,
        'OcorrenciasService',
      );
    }
    try {
      await this.notifications.notifyAssignment(oc, colaborador);
    } catch (err) {
      Logger.warn(
        `Falha ao enviar notificação de atribuição: ${String(err)}`,
        'OcorrenciasService',
      );
    }
    return oc;
  }

  async logStatus(oc: Ocorrencia, status: StatusEntity) {
    const h = this.histRepo.create({ ocorrencia: oc, status });
    return this.histRepo.save(h);
  }

  async mudarStatus(
    ocorrenciaId: number,
    status: number | string,
    actorId?: number,
  ) {
    const oc = await this.repo.findOne({
      where: { id: ocorrenciaId },
      relations: ['historicos', 'status'],
    });
    if (!oc) throw new NotFoundException('Ocorrencia not found');
    const oldStatus = oc.status?.chave ?? undefined;
    if (typeof status === 'number') {
      const s = await this.statusRepo.findOne({ where: { id: status } });
      if (!s) throw new NotFoundException('Status not found');
      oc.status = s;
    } else {
      const s = await this.statusRepo.findOne({ where: { chave: status } });
      if (!s) throw new NotFoundException('Status not found');
      oc.status = s;
    }
    await this.repo.save(oc);
    await this.logStatus(oc, oc.status);
    try {
      await this.audit.log(
        actorId ?? null,
        'update_ocorrencia_status',
        'ocorrencia',
        oc.id,
      );
    } catch (err) {
      Logger.warn(
        `Falha ao registrar auditoria de mudança de status: ${
          err instanceof Error ? err.message : String(err)
        }`,
        'OcorrenciasService',
      );
    }
    try {
      const newStatus = oc.status?.chave ?? undefined;
      await this.notifications.notifyStatusChange(oc, oldStatus, newStatus);
    } catch (err) {
      Logger.warn(
        `Falha ao enviar notificação de mudança de status: ${String(err)}`,
        'OcorrenciasService',
      );
    }
    return oc;
  }

  async remove(id: number, actorId?: number) {
    const oc = await this.repo.findOne({
      where: { id },
      relations: ['subtarefas', 'historicos'],
    });
    if (!oc) throw new NotFoundException('Ocorrencia not found');

    try {
      await this.repo.query(
        'DELETE FROM historico_status WHERE "ocorrenciaId" = $1',
        [id],
      );
      await this.repo.query(
        'DELETE FROM subtarefas WHERE "ocorrenciaId" = $1',
        [id],
      );

      await this.repo.remove(oc);
    } catch (err) {
      Logger.error(
        `Falha ao excluir ocorrencia ${id}: ${err instanceof Error ? err.message : String(err)}`,
        'OcorrenciasService',
      );
      throw err;
    }

    try {
      await this.audit.log(
        actorId ?? null,
        'delete_ocorrencia',
        'ocorrencia',
        id,
      );
    } catch (err) {
      Logger.warn(
        `Falha ao registrar auditoria de exclusão: ${
          err instanceof Error ? err.message : String(err)
        }`,
        'OcorrenciasService',
      );
    }

    return { deleted: true };
  }

  async atribuirAutomaticamente(ocorrenciaId: number, actorId?: number) {
    const oc = await this.repo.findOne({
      where: { id: ocorrenciaId },
      relations: ['setor', 'status'],
    });
    if (!oc) throw new NotFoundException('Ocorrencia not found');
    if (!oc.setor?.id)
      throw new BadRequestException(
        'Ocorrencia sem setor; não é possível auto atribuir',
      );

    const colaborador = await this.findLeastLoadedCollaboradorBySetor(
      oc.setor.id,
    );
    if (!colaborador)
      throw new NotFoundException(
        'Nenhum colaborador elegível encontrado para o setor',
      );

    return this.atribuirColaborador(
      oc.id,
      colaborador.id,
      Status.EM_FILA,
      actorId,
    );
  }

  async findLeastLoadedCollaboradorBySetor(
    setorId: number,
  ): Promise<User | null> {
    // Descobre o id do status ENTREGUE para excluir da contagem
    const entregue = await this.statusRepo.findOne({
      where: { chave: Status.ENTREGUE },
    });
    const entregueId = entregue?.id ?? null;

    // Ordena colaboradores do setor pelo número de ocorrências não entregues
    const countExpr =
      entregueId === null
        ? '(SELECT COUNT(*) FROM ocorrencias o WHERE o."colaboradorId" = u.id)'
        : '(SELECT COUNT(*) FROM ocorrencias o WHERE o."colaboradorId" = u.id AND (o."statusId" IS NULL OR o."statusId" != :entregueId))';
    const loadExpr = `CASE WHEN COALESCE(u.peso, 1) = 0 THEN 999999 ELSE (${countExpr}) / COALESCE(u.peso, 1) END`;

    const qb = this.userRepo
      .createQueryBuilder('u')
      .where('u.perfil = :perfil', { perfil: Perfil.COLABORADOR })
      .andWhere('u.setorId = :setorId', { setorId })
      .orderBy(loadExpr, 'ASC')
      .addOrderBy('u.id', 'ASC');

    if (entregueId !== null) qb.setParameter('entregueId', entregueId);

    const user = await qb.getOne();
    return user ?? null;
  }

  async updateOcorrencia(
    id: number,
    input: {
      titulo?: string;
      descricao?: string;
      setorId?: number;
      documentacaoUrl?: string; // 👈 ADICIONE
      descricaoExecucao?: string; // 👈 ADICIONE
    },
    actorId?: number,
  ) {
    const oc = await this.repo.findOne({ where: { id }, relations: ['setor'] });
    if (!oc) throw new NotFoundException('Ocorrencia not found');

    if (typeof input.titulo === 'string') oc.titulo = input.titulo;
    if (typeof input.descricao === 'string') oc.descricao = input.descricao;

    // 👇 ADICIONE ESTAS LINHAS
    if (typeof input.documentacaoUrl === 'string')
      oc.documentacaoUrl = input.documentacaoUrl;
    if (typeof input.descricaoExecucao === 'string')
      oc.descricaoExecucao = input.descricaoExecucao;

    if (typeof input.setorId === 'number') {
      const setor = await this.setorRepo.findOne({
        where: { id: input.setorId },
        relations: ['users'],
      });
      if (!setor) throw new NotFoundException('Setor not found');

      oc.setor = setor;
      const gestor = setor.users?.find((u) => u.perfil === Perfil.GESTOR);
      if (gestor) oc.gestor = gestor;
    }

    const saved = await this.repo.save(oc);

    try {
      await this.audit.log(
        actorId ?? null,
        'update_ocorrencia',
        'ocorrencia',
        saved.id,
      );
    } catch (err) {
      // omit audit failure
    }

    return saved;
  }
}
