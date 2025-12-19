import { Controller, Post, Param, Body, UseGuards, Delete, Req, Patch } from '@nestjs/common';
import { SubtarefasService } from './subtarefas.service';
import { CreateSubtarefaDto } from './dto/create-subtarefa.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';

@Controller('ocorrencias/:ocorrenciaId/subtarefas')
@UseGuards(AuthGuard('jwt'))
export class SubtarefasController {
  constructor(private readonly subtarefasService: SubtarefasService) {}

  @Post()
  async create(
    @Param('ocorrenciaId') ocorrenciaId: number,
    @Body() dto: CreateSubtarefaDto,
    @Req() req: Request,
  ) {
    const actorId = (req as any).user?.id as number | undefined;
    return this.subtarefasService.create(ocorrenciaId, dto, actorId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: any) {
    const actorId = req.user?.id;
    return this.subtarefasService.remove(+id, actorId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: any,
  ) {
    const actorId = req.user?.id;
    return this.subtarefasService.update(+id, dto, actorId);
  }
}
