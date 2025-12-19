import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Perfil } from 'src/common/enums';
import type { Request } from 'express';

type ReqWithUser = Request & { user?: { id?: number } };

@Controller('status')
export class StatusController {
  constructor(private svc: StatusService) {}

  @Get()
  async findAll(@Query('workflowId') workflowId?: string) {
    // ✅ CORRIGIDO: Filtrar por workflowId se fornecido
    let statuses = await this.svc.findAll();

    if (workflowId) {
      const wfId = Number(workflowId);
      statuses = statuses.filter((s) => s.workflowId === wfId || !s.workflowId);
    }

    return statuses.map((status) => ({
      ...status,
      workflowId: status.workflowId || null, // ✅ Garantir workflowId no retorno
    }));
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Post()
  create(
    @Body()
    body: { chave: string; nome?: string; ordem?: number; workflowId?: number },
    @Req() req: ReqWithUser,
  ) {
    const actorId = req.user?.id;
    return this.svc.create(body, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: ReqWithUser) {
    const actorId = req.user?.id;
    return this.svc.update(+id, body, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ReqWithUser) {
    const actorId = req.user?.id;
    return this.svc.delete(+id, actorId);
  }
}
