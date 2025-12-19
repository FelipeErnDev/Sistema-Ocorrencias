import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { hash } from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Perfil } from 'src/common/enums';
import { Setor } from 'src/setores/setor.entity';
import { Ocorrencia } from 'src/ocorrencias/ocorrencia.entity';
import { AuditLog } from 'src/audit/audit.entity';
import { AuditService } from 'src/audit/audit.service';
import { Workflow } from 'src/workflows/workflow.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    @InjectRepository(Setor) private setorRepo: Repository<Setor>,
    @InjectRepository(Ocorrencia)
    private ocorrenciaRepo: Repository<Ocorrencia>,
    private audit: AuditService,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateUserDto, actorId?: number) {
    const email = (dto.email ?? '').trim().toLowerCase();
    const existing = await this.findOneByEmail(email);
    if (existing) {
      throw new ConflictException('Email já está em uso');
    }

    const senhaHash = await hash(dto.senha, 10);
    const user = this.repo.create({
      nome: dto.nome,
      email,
      senhaHash,
      perfil: dto.perfil as Perfil,
    });
    if (typeof dto.peso === 'number') {
      if (Number.isNaN(dto.peso) || dto.peso < 0 || dto.peso > 1) {
        throw new BadRequestException('peso deve estar entre 0 e 1');
      }
      user.peso = dto.peso;
    }
    if (dto.setorId) {
      const setor = await this.setorRepo.findOne({
        where: { id: dto.setorId },
      });
      if (!setor) throw new NotFoundException('Setor not found');
      user.setor = setor;
    }
    try {
      const saved = await this.repo.save(user);
      void this.audit.log(actorId ?? null, 'create_user', 'user', saved.id);
      return saved;
    } catch (err: any) {
      if (
        err &&
        (err.code === '23505' || /unique/i.test(String(err.message)))
      ) {
        throw new ConflictException('Email já está em uso');
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  async updatePeso(id: number, peso: number, actorId?: number) {
    if (!Number.isFinite(peso)) throw new BadRequestException('peso inválido');
    if (peso < 0 || peso > 1)
      throw new BadRequestException('peso deve estar entre 0 e 1');
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    user.peso = peso;
    const saved = await this.repo.save(user);
    try {
      await this.audit.log(actorId ?? null, 'update_user_peso', 'user', id);
    } catch (err) {
      // omit failure
    }
    return saved;
  }

  async updateUser(id: number, dto: UpdateUserDto, actorId?: number) {
    const user = await this.repo.findOne({
      where: { id },
      relations: ['setor'], // ✅ Remover 'workflows'
    });
    if (!user) throw new NotFoundException('User not found');

    // Validar email único se estiver mudando
    if (
      typeof dto.email === 'string' &&
      dto.email.trim().length > 0 &&
      dto.email.trim().toLowerCase() !== user.email
    ) {
      const existing = await this.findOneByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ConflictException('Email já está em uso');
      }
      user.email = dto.email.trim().toLowerCase();
    }

    // Atualizar campos somente se foram fornecidos
    if (typeof dto.nome !== 'undefined') {
      user.nome = dto.nome ?? user.nome;
    }

    if (
      typeof (dto as any).senha !== 'undefined' &&
      (dto as any).senha !== null
    ) {
      const senha = (dto as any).senha as string;
      if (senha && senha.length > 0) {
        user.senhaHash = await hash(senha, 10);
      }
    }

    if (typeof dto.perfil !== 'undefined') {
      user.perfil = dto.perfil as any;
    }

    if (typeof dto.peso !== 'undefined') {
      if (!Number.isFinite(dto.peso) || dto.peso < 0 || dto.peso > 1) {
        throw new BadRequestException('peso deve estar entre 0 e 1');
      }
      user.peso = dto.peso;
    }

    if (typeof dto.setorId !== 'undefined') {
      if (dto.setorId === null) {
        user.setor = null as any;
      } else {
        const setor = await this.setorRepo.findOne({
          where: { id: dto.setorId },
        });
        if (!setor) throw new NotFoundException('Setor not found');
        user.setor = setor;
      }
    }

    // CORRIGIDO: Salvar workflowIds diretamente como array
    if (Array.isArray(dto.workflowIds)) {
      const workflowRepo = this.dataSource.getRepository(Workflow);

      // Validar que todos os workflows existem
      if (dto.workflowIds.length > 0) {
        const workflows = await workflowRepo.find({
          where: { id: In(dto.workflowIds) },
        });

        if (workflows.length !== dto.workflowIds.length) {
          throw new NotFoundException('Um ou mais workflows não encontrados');
        }
      }

      // Atualizar o array de workflowIds
      user.workflowIds = dto.workflowIds;
    }

    try {
      // Salvar usuário com workflowIds
      const saved = await this.repo.save(user);

      // Recarregar com relações
      const result = await this.repo.findOne({
        where: { id: saved.id },
        relations: ['setor'],
      });

      try {
        await this.audit.log(actorId ?? null, 'update_user', 'user', saved.id);
      } catch (err) {
        // omit audit failure
      }

      return result;
    } catch (err: any) {
      if (
        err &&
        (err.code === '23505' || /unique/i.test(String(err.message)))
      ) {
        throw new ConflictException('Email já está em uso');
      }
      throw new InternalServerErrorException(
        err?.message || 'Erro ao atualizar usuário',
      );
    }
  }

  findAll() {
    return this.repo.find({ relations: ['setor'] }); // ✅ Remover 'workflows'
  }

  findOneByEmail(email: string) {
    const normalized = (email ?? '').trim();
    return this.repo
      .createQueryBuilder('u')
      .where('LOWER(u.email) = LOWER(:email)', { email: normalized })
      .getOne();
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['setor'], // ✅ Remover 'workflows'
    });
  }

  async remove(id: number, actorId?: number) {
    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException('User not found');
    if (actorId) await this.audit.log(actorId, 'delete_user', 'user', id);
    return { deleted: true };
  }

  async findOcorrenciasByUser(userId: number) {
    return this.ocorrenciaRepo.find({
      where: [{ gestor: { id: userId } }, { colaborador: { id: userId } }],
      relations: ['gestor', 'colaborador', 'setor', 'subtarefas', 'historicos'],
    });
  }

  async handleDeleteAction(userId: number, body: any, actorId?: number) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const mode: string = body?.mode;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const occRepo = queryRunner.manager.getRepository(Ocorrencia);
      const userRepo = queryRunner.manager.getRepository(User);
      const auditRepo = queryRunner.manager.getRepository(AuditLog);

      let transferredCount = 0;
      let deletedCount = 0;

      const extractIds = (rows: any[]): number[] => {
        if (!rows || rows.length === 0) return [];
        return rows
          .map((r) => {
            if (typeof r === 'number') return r;
            if (r === null || r === undefined) return null as any;
            if (typeof r.id !== 'undefined') return Number(r.id);
            const first = Object.values(r)[0];
            return typeof first === 'number' ? first : Number(first);
          })
          .filter((n) => !Number.isNaN(n)) as number[];
      };

      if (mode === 'delete') {
        const occs = await occRepo.find({
          where: [{ gestor: { id: userId } }, { colaborador: { id: userId } }],
        });
        const occIds = occs.map((o) => o.id);
        if (occIds.length > 0) {
          const deletedSubRows: any[] = await queryRunner.query(
            'DELETE FROM subtarefas s USING ocorrencias o WHERE s."ocorrenciaId" = o.id AND (o."colaboradorId" = $1 OR o."gestorId" = $1) RETURNING s.id',
            [userId],
          );
          const deletedSubIds = extractIds(deletedSubRows);
          for (const sid of deletedSubIds) {
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'delete_subtarefa',
              targetType: 'subtarefa',
              targetId: sid,
            });
          }

          const deletedHistRows: any[] = await queryRunner.query(
            'DELETE FROM historico_status h USING ocorrencias o WHERE h."ocorrenciaId" = o.id AND (o."colaboradorId" = $1 OR o."gestorId" = $1) RETURNING h.id',
            [userId],
          );
          const deletedHistIds = extractIds(deletedHistRows);
          for (const hid of deletedHistIds) {
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'delete_historico',
              targetType: 'historico_status',
              targetId: hid,
            });
          }

          const deletedOccRows: any[] = await queryRunner.query(
            'DELETE FROM ocorrencias WHERE "colaboradorId" = $1 OR "gestorId" = $1 RETURNING id',
            [userId],
          );
          const deletedOccIds = extractIds(deletedOccRows);
          for (const id of deletedOccIds) {
            deletedCount++;
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'delete_ocorrencia',
              targetType: 'ocorrencia',
              targetId: id,
            });
          }
        }
      } else if (mode === 'transfer') {
        const toId: number = body?.transferToUserId;
        if (!toId)
          throw new BadRequestException('transferToUserId is required');
        const target = await userRepo.findOne({ where: { id: toId } });
        if (!target) throw new NotFoundException('Target user not found');
        const rows: Array<{ id: number }> = await queryRunner.query(
          'SELECT id FROM ocorrencias WHERE "colaboradorId" = $1 OR "gestorId" = $1',
          [userId],
        );
        const ids = rows.map((r) => r.id);
        if (ids.length > 0) {
          await queryRunner.query(
            'UPDATE ocorrencias SET "colaboradorId" = $1 WHERE "colaboradorId" = $2',
            [toId, userId],
          );
          await queryRunner.query(
            'UPDATE ocorrencias SET "gestorId" = $1 WHERE "gestorId" = $2',
            [toId, userId],
          );
          const transferredSubs: any[] =
            ids.length > 0
              ? await queryRunner.query(
                  `UPDATE subtarefas SET "responsavelId" = ${toId} WHERE "ocorrenciaId" IN (${ids.join(',')}) AND "responsavelId" = ${userId} RETURNING id`,
                )
              : [];
          const transferredSubIds = extractIds(transferredSubs);
          for (const sid of transferredSubIds) {
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'transfer_subtarefa',
              targetType: 'subtarefa',
              targetId: sid,
            });
          }
          for (const id of ids) {
            transferredCount++;
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'transfer_ocorrencia',
              targetType: 'ocorrencia',
              targetId: id,
            });
          }
        }
      } else if (mode === 'mixed') {
        const toId: number = body?.transferToUserId;
        const transferIds: number[] = body?.transferIds || [];
        if (!toId)
          throw new BadRequestException(
            'transferToUserId is required for mixed',
          );
        const target = await userRepo.findOne({ where: { id: toId } });
        if (!target) throw new NotFoundException('Target user not found');
        if (transferIds.length > 0) {
          const foundRows: Array<{ id: number }> = await queryRunner.query(
            'SELECT id FROM ocorrencias WHERE id = ANY($1::int[]) AND ("colaboradorId" = $2 OR "gestorId" = $2)',
            [transferIds, userId],
          );
          const foundIds = foundRows.map((r) => r.id);
          if (foundIds.length !== transferIds.length)
            throw new BadRequestException(
              'One or more transferIds do not belong to user',
            );
          const transferredSubs: any[] =
            transferIds.length > 0
              ? await queryRunner.query(
                  `UPDATE subtarefas SET "responsavelId" = ${toId} WHERE "ocorrenciaId" IN (${transferIds.join(',')}) AND "responsavelId" = ${userId} RETURNING id`,
                )
              : [];
          const transferredSubIds = extractIds(transferredSubs);
          for (const sid of transferredSubIds) {
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'transfer_subtarefa',
              targetType: 'subtarefa',
              targetId: sid,
            });
          }
          await queryRunner.query(
            'UPDATE ocorrencias SET "colaboradorId" = $1 WHERE id = ANY($2::int[])',
            [toId, transferIds],
          );
          await queryRunner.query(
            'UPDATE ocorrencias SET "gestorId" = $1 WHERE id = ANY($2::int[])',
            [toId, transferIds],
          );
          for (const id of transferIds) {
            transferredCount++;
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'transfer_ocorrencia',
              targetType: 'ocorrencia',
              targetId: id,
            });
          }
        }
        const remainingRows: Array<{ id: number }> =
          transferIds.length > 0
            ? await queryRunner.query(
                `SELECT id FROM ocorrencias WHERE ("colaboradorId" = ${userId} OR "gestorId" = ${userId}) AND NOT (id IN (${transferIds.join(',')}))`,
              )
            : await queryRunner.query(
                `SELECT id FROM ocorrencias WHERE ("colaboradorId" = ${userId} OR "gestorId" = ${userId})`,
              );
        const remainingIds = remainingRows.map((r) => r.id);
        if (remainingIds.length > 0) {
          const allSubRows: any[] =
            remainingIds.length > 0
              ? await queryRunner.query(
                  `SELECT id FROM subtarefas WHERE "ocorrenciaId" IN (${remainingIds.join(',')})`,
                )
              : [];
          const allSubIds = extractIds(allSubRows);
          if (allSubIds.length > 0) {
            await queryRunner.query(
              'DELETE FROM subtarefas WHERE id = ANY($1::int[])',
              [allSubIds],
            );
            for (const sid of allSubIds) {
              await auditRepo.save({
                actorId: actorId ?? null,
                action: 'delete_subtarefa',
                targetType: 'subtarefa',
                targetId: sid,
              });
            }
          }
          const deletedHistRows2: any[] =
            remainingIds.length > 0
              ? await queryRunner.query(
                  `DELETE FROM historico_status WHERE "ocorrenciaId" IN (${remainingIds.join(',')}) RETURNING id`,
                )
              : [];
          const deletedHistIds2 = extractIds(deletedHistRows2);
          for (const hid of deletedHistIds2) {
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'delete_historico',
              targetType: 'historico_status',
              targetId: hid,
            });
          }
          await queryRunner.query(
            `DELETE FROM ocorrencias WHERE id IN (${remainingIds.join(',')})`,
          );
          for (const id of remainingIds) {
            deletedCount++;
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'delete_ocorrencia',
              targetType: 'ocorrencia',
              targetId: id,
            });
          }
        }
      } else {
        throw new BadRequestException('Invalid mode');
      }

      if (mode === 'transfer' || mode === 'mixed') {
        const toId: number = body?.transferToUserId;
        if (toId) {
          const transferredAllSubs: any[] = await queryRunner.query(
            'UPDATE subtarefas SET "responsavelId" = $1 WHERE "responsavelId" = $2 RETURNING id',
            [toId, userId],
          );
          const transferredAllIds = extractIds(transferredAllSubs);
          for (const sid of transferredAllIds) {
            await auditRepo.save({
              actorId: actorId ?? null,
              action: 'transfer_subtarefa',
              targetType: 'subtarefa',
              targetId: sid,
            });
          }
        }
      } else {
        const nullified: any[] = await queryRunner.query(
          'UPDATE subtarefas SET "responsavelId" = NULL WHERE "responsavelId" = $1 RETURNING id',
          [userId],
        );
        const nullifiedIds = extractIds(nullified);
        for (const sid of nullifiedIds) {
          await auditRepo.save({
            actorId: actorId ?? null,
            action: 'nullify_subtarefa_responsavel',
            targetType: 'subtarefa',
            targetId: sid,
          });
        }
      }

      const res = await userRepo.delete(userId);
      if (res.affected === 0) throw new NotFoundException('User not found');
      await auditRepo.save({
        actorId: actorId ?? null,
        action: 'delete_user',
        targetType: 'user',
        targetId: userId,
      });

      await queryRunner.commitTransaction();
      return {
        deleted: true,
        transferred: transferredCount,
        removed: deletedCount,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        err?.message || 'Error handling delete action',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async listWorkflows() {
    const workflowRepo = this.dataSource.getRepository(Workflow);
    return workflowRepo.find();
  }

  // ✅ ADICIONADO: Método para alterar senha
  async changePassword(userId: number, senhaAtual: string, novaSenha: string) {
    if (!senhaAtual || !novaSenha) {
      throw new BadRequestException(
        'Senha atual e nova senha são obrigatórias',
      );
    }

    if (novaSenha.length < 3) {
      throw new BadRequestException(
        'Nova senha deve ter pelo menos 3 caracteres',
      );
    }

    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se a senha atual está correta
    const senhaCorreta = await bcrypt.compare(senhaAtual, user.senhaHash);
    if (!senhaCorreta) {
      throw new UnauthorizedException('Senha atual incorreta');
    }

    // Criptografar nova senha
    const novoHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar no banco
    user.senhaHash = novoHash;
    await this.repo.save(user);

    return { message: 'Senha alterada com sucesso' };
  }

  // ✅ CORRIGIDO: Método updateMe para aceitar senhaAtual e novaSenha
  async updateMe(
    userId: number,
    input: {
      nome?: string;
      email?: string;
      senhaAtual?: string;
      senha?: string;
      setorId?: number;
    },
  ) {
    const user = await this.repo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    if (typeof input.nome === 'string') user.nome = input.nome;
    if (typeof input.email === 'string') user.email = input.email;

    // ✅ CORRIGIDO: Validar e atualizar senha com regras
    if (typeof input.senha === 'string') {
      // ✅ IMPORTANTE: Se tem senha para alterar, DEVE ter senhaAtual
      if (!input.senhaAtual) {
        throw new BadRequestException(
          'Senha atual é obrigatória para alterar a senha',
        );
      }

      // Validar se a senha atual está correta
      const senhaCorreta = await bcrypt.compare(
        input.senhaAtual,
        user.senhaHash,
      );
      if (!senhaCorreta) {
        throw new UnauthorizedException('Senha atual incorreta');
      }

      // Validar comprimento mínimo
      if (input.senha.length < 6) {
        throw new BadRequestException('Senha deve ter no mínimo 6 caracteres');
      }

      // Validar se é diferente da senha anterior
      const senhaIgual = await bcrypt.compare(input.senha, user.senhaHash);
      if (senhaIgual) {
        throw new BadRequestException(
          'Nova senha não pode ser igual à anterior',
        );
      }

      user.senhaHash = await bcrypt.hash(input.senha, 10);
    }

    // Atualizar setor se fornecido
    if (typeof input.setorId === 'number' && input.setorId > 0) {
      const setor = await this.repo
        .createQueryBuilder()
        .select()
        .from('setores', 'setor')
        .where('setor.id = :id', { id: input.setorId })
        .getRawOne();

      if (setor) {
        user.setor = { id: input.setorId } as any;
      }
    }

    const updated = await this.repo.save(user);

    // Omitir senhaHash na resposta
    const { senhaHash, ...result } = updated;
    return result;
  }
}
