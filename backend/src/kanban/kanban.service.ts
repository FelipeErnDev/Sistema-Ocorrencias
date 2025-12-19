import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from '../status/status.entity';
import { Ocorrencia } from '../ocorrencias/ocorrencia.entity';

@Injectable()
export class KanbanService {
  constructor(
    @InjectRepository(StatusEntity) private statusRepo: Repository<StatusEntity>,
    @InjectRepository(Ocorrencia) private ocorrenciaRepo: Repository<Ocorrencia>,
  ) {}

  async getKanbanData(
    titulo?: string,
    setorId?: number,
    statusChave?: string,
    workflowId?: number,
    order?: string,
  ) {
    // ✅ Buscar todos os status ordenados
    const statuses = await this.statusRepo.find({
      order: { ordem: 'ASC' },
      where: workflowId ? { workflowId } : undefined,
    });

    // ✅ Buscar ocorrências com filtros
    const qb = this.ocorrenciaRepo
      .createQueryBuilder('o')
      .leftJoinAndSelect('o.status', 'status')
      .leftJoinAndSelect('o.colaborador', 'colaborador')
      .leftJoinAndSelect('o.setor', 'setor')
      .leftJoinAndSelect('o.workflow', 'workflow')
      .leftJoinAndSelect('o.subtarefas', 'subtarefas')
      .leftJoinAndSelect('o.historicos', 'historicos');

    if (titulo) {
      qb.andWhere('LOWER(o.titulo) LIKE :t', {
        t: `%${titulo.toLowerCase()}%`,
      });
    }
    if (setorId) {
      qb.andWhere('o.setorId = :sid', { sid: setorId });
    }
    if (statusChave) {
      qb.andWhere('status.chave = :schave', { schave: statusChave });
    }
    if (workflowId) {
      qb.andWhere('o.workflowId = :wfId', { wfId: workflowId });
    }

    const sortOrder = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    qb.orderBy('o.createdAt', sortOrder);

    const ocorrencias = await qb.getMany();

    // ✅ Transformar em estrutura de colunas
    const columns = statuses.map((status) => ({
      id: `status-${status.id}`,
      statusId: status.id,
      statusChave: status.chave,
      titulo: status.nome,
      ordem: status.ordem,
      workflowId: status.workflowId,
      cards: ocorrencias
        .filter((occ) => occ.status?.id === status.id)
        .map((occ) => ({
          id: `card-${occ.id}`,
          titulo: occ.titulo,
          descricao: occ.descricao,
          colaboradorNome: occ.colaborador?.nome,
          createdAt: occ.createdAt,
          statusId: occ.status?.id,
          statusNome: occ.status?.nome,
          ocorrencia: occ,
        })),
    }));

    return columns;
  }
}
