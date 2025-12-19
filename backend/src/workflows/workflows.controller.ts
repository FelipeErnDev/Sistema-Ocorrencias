import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  Req,
  Patch,
} from '@nestjs/common';
import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Perfil } from 'src/common/enums';
import type { Request } from 'express';

type ReqWithUser = Request & { user?: { id?: number } };

@Controller('workflows')
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Post()
  create(@Body() dto: CreateWorkflowDto, @Req() req: ReqWithUser) {
    const actorId = req.user?.id;
    return this.workflowsService.create(dto, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR, Perfil.COLABORADOR)
  @Get()
  findAll() {
    // ✅ Sempre consultar banco sem cache
    return this.workflowsService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workflowsService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowDto,
    @Req() req: ReqWithUser,
  ) {
    const actorId = req.user?.id;
    return this.workflowsService.update(+id, dto, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.workflowsService.remove(+id);
  }
}
