import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusEntity } from './status.entity';
import { Status } from 'src/common/enums';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(StatusEntity) private repo: Repository<StatusEntity>,
    private audit: AuditService,
  ) {}

  findAll() {
    return this.repo.find({ order: { ordem: 'ASC' } });
  }

  async create(dto: Partial<StatusEntity>, actorId?: number) {
    const s = this.repo.create(dto);
    const saved = await this.repo.save(s);
    try {
      await this.audit.log(
        actorId ?? null,
        'create_status',
        'status',
        saved.id,
      );
    } catch {
      // omit audit failure
    }
    return saved;
  }

  async update(id: number, dto: Partial<StatusEntity>, actorId?: number) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) return null;
    Object.assign(s, dto);
    const saved = await this.repo.save(s);
    try {
      await this.audit.log(
        actorId ?? null,
        'update_status',
        'status',
        saved.id,
      );
    } catch {
      // omit audit failure
    }
    return saved;
  }

  async delete(id: number, actorId?: number) {
    const res = await this.repo.delete(id);
    if (res.affected && actorId) {
      try {
        await this.audit.log(
          actorId,
          'delete_status',
          'status',
          id,
        );
      } catch {
        // omit
      }
    }
    return res;
  }

  async seedDefaults() {
    const existing = await this.repo.find();
    if (existing.length > 0) return;
    const vals = Object.values(Status) as string[];
    for (let i = 0; i < vals.length; i++) {
      await this.repo.save({ chave: vals[i], nome: vals[i], ordem: i });
    }
  }
}
