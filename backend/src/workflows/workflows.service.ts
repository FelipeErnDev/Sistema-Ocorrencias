import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workflow } from './workflow.entity';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { Ocorrencia } from 'src/ocorrencias/ocorrencia.entity';
import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class WorkflowsService {
  constructor(
    @InjectRepository(Workflow)
    private readonly repo: Repository<Workflow>,
    @InjectRepository(Ocorrencia)
    private readonly ocRepo: Repository<Ocorrencia>,
    private readonly auditService: AuditService,
  ) {}

  async create(dto: CreateWorkflowDto, actorId?: number) {
    const wf = this.repo.create(dto);
    const saved = await this.repo.save(wf);
    await this.auditService.log(
      actorId ?? null,
      'create_workflow',
      'workflow',
      saved.id,
    );
    return saved;
  }

  async findAll() {
    return this.repo.find({ relations: ['ocorrencias'] });
  }

  async findOne(id: number) {
    const wf = await this.repo.findOne({
      where: { id },
      relations: ['ocorrencias'],
    });
    if (!wf) throw new NotFoundException('Workflow not found');
    return wf;
  }

  async update(id: number, dto: UpdateWorkflowDto, actorId?: number) {
    const wf = await this.findOne(id);
    Object.assign(wf, dto);
    const saved = await this.repo.save(wf);
    await this.auditService.log(
      actorId ?? null,
      'update_workflow',
      'workflow',
      saved.id,
    );
    return saved;
  }

  async remove(id: number, actorId?: number) {
    // find occurrences related to this workflow and log deletions for subtasks/historicos/ocorrencias
    const ocorrencias = await this.ocRepo.find({
      where: { workflow: { id } },
      relations: ['subtarefas', 'historicos'],
    });

    for (const occ of ocorrencias) {
      if (occ.subtarefas) {
        for (const st of occ.subtarefas) {
          await this.auditService.log(
            actorId ?? null,
            'delete_subtarefa',
            'subtarefa',
            st.id,
          );
        }
      }
      if (occ.historicos) {
        for (const h of occ.historicos) {
          await this.auditService.log(
            actorId ?? null,
            'delete_historico_status',
            'historico_status',
            h.id,
          );
        }
      }
      await this.auditService.log(
        actorId ?? null,
        'delete_ocorrencia',
        'ocorrencia',
        occ.id,
      );
    }

    const res = await this.repo.delete(id);
    if (res.affected === 0) throw new NotFoundException('Workflow not found');

    await this.auditService.log(
      actorId ?? null,
      'delete_workflow',
      'workflow',
      id,
    );
    return { deleted: true };
  }
}
