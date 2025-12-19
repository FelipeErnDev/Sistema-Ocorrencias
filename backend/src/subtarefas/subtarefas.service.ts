import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtarefa } from './subtarefa.entity';
import { Ocorrencia } from '../ocorrencias/ocorrencia.entity';
import { User } from '../users/user.entity';
import { CreateSubtarefaDto } from './dto/create-subtarefa.dto';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class SubtarefasService {
  constructor(
    @InjectRepository(Subtarefa) private subtarefaRepo: Repository<Subtarefa>,
    @InjectRepository(Ocorrencia) private ocorrenciaRepo: Repository<Ocorrencia>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private audit: AuditService,
  ) {}

  async create(ocorrenciaId: number, dto: CreateSubtarefaDto, actorId?: number) {
    const ocorrencia = await this.ocorrenciaRepo.findOne({ where: { id: ocorrenciaId } });
    if (!ocorrencia) throw new NotFoundException('Ocorrência não encontrada');
    let responsavel: User | null = null;
    if (dto.responsavelId) {
      const found = await this.userRepo.findOne({ where: { id: dto.responsavelId } });
      if (!found) throw new NotFoundException('Responsável não encontrado');
      responsavel = found;
    }
    const subtarefa = this.subtarefaRepo.create({
      titulo: dto.titulo,
      descricao: dto.descricao,
      ocorrencia,
      responsavel,
    });
    const saved = await this.subtarefaRepo.save(subtarefa);
    try {
      await this.audit.log(actorId ?? null, 'create_subtarefa', 'subtarefa', saved.id);
    } catch (e) {}
    return saved;
  }

  async remove(id: number, actorId?: number) {
    const res = await this.subtarefaRepo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Subtarefa not found');
    if (actorId) await this.audit.log(actorId, 'delete_subtarefa', 'subtarefa', id);
    return { deleted: true };
  }

  async update(id: number, dto: Partial<CreateSubtarefaDto>, actorId?: number) {
    const item = await this.subtarefaRepo.findOne({ where: { id }, relations: ['ocorrencia'] });
    if (!item) throw new NotFoundException('Subtarefa not found');
    if (dto.titulo !== undefined) item.titulo = dto.titulo;
    if (dto.descricao !== undefined) item.descricao = dto.descricao;
    if (dto.responsavelId !== undefined) {
      if (dto.responsavelId === null) {
        item.responsavel = null;
      } else {
        const found = await this.userRepo.findOne({ where: { id: dto.responsavelId } });
        if (!found) throw new NotFoundException('Responsável não encontrado');
        item.responsavel = found;
      }
    }
    const saved = await this.subtarefaRepo.save(item);
    try {
      await this.audit.log(actorId ?? null, 'update_subtarefa', 'subtarefa', saved.id);
    } catch (e) {}
    return saved;
  }
}
