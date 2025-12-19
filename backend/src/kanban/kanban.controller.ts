import { Controller, Get, Query } from '@nestjs/common';
import { KanbanService } from './kanban.service';

@Controller('kanban')
export class KanbanController {
  constructor(private svc: KanbanService) {}

  @Get()
  async getKanbanData(
    @Query('titulo') titulo?: string,
    @Query('setorId') setorId?: string,
    @Query('status') status?: string,
    @Query('workflowId') workflowId?: string,
    @Query('order') order?: string,
  ) {
    const sid = setorId ? Number(setorId) : undefined;
    const wfId = workflowId ? Number(workflowId) : undefined;
    return this.svc.getKanbanData(titulo, sid, status, wfId, order);
  }
}
