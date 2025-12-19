import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  BadRequestException,
  NotFoundException,
  Query,
  UseGuards,
  Delete,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { UsersService } from '../users/users.service';
import { OcorrenciasService } from './ocorrencias.service';
import { Status, Perfil } from 'src/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Setor } from '../setores/setor.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import {
  CreateOcorrenciaDto,
  CreateOcorrenciaPublicDto,
} from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';

@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(
    private svc: OcorrenciasService,
    private usersSvc: UsersService,
    @InjectRepository(Setor) private setorRepo: Repository<Setor>,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: CreateOcorrenciaDto, @Req() req: any) {
    const actorId = req.user?.id as number | undefined;
    if (!actorId) {
      throw new BadRequestException('Usuário não autenticado');
    }

    const colaboradorIdVal = dto.colaboradorId || actorId;
    const colaborador = await this.usersSvc.findOne(colaboradorIdVal);
    if (!colaborador) {
      throw new NotFoundException('Colaborador não encontrado');
    }

    let setor: any = null;
    let gestor: any = null;

    if (dto.setorId) {
      setor = await this.setorRepo.findOne({
        where: { id: dto.setorId },
        relations: ['users'],
      });
      if (!setor) throw new NotFoundException('Setor não encontrado');
      gestor = setor.users.find((u) => u.perfil === Perfil.GESTOR);
    } else {
      if (colaborador.setor) {
        setor = colaborador.setor;
        gestor = colaborador.setor.users?.find(
          (u: any) => u.perfil === Perfil.GESTOR,
        );
      }
    }

    let workflowIdVal: number | undefined;
    if (typeof dto.workflowId !== 'undefined') {
      workflowIdVal = dto.workflowId;
      if (!Number.isInteger(workflowIdVal)) {
        throw new BadRequestException('workflowId deve ser um inteiro');
      }
    }

    // ✅ ADICIONADO: Processar statusId
    let statusVal: any = null;
    if (typeof dto.statusId === 'number') {
      statusVal = await this.svc.getStatusById(dto.statusId);
      if (!statusVal) {
        throw new NotFoundException(
          `Status com ID ${dto.statusId} não encontrado`,
        );
      }
    }

    const payload: any = {
      titulo: dto.titulo,
      descricao: dto.descricao || '',
      colaborador,
      gestor: gestor || null,
      setor: setor || null,
      ...(statusVal ? { status: statusVal } : {}), // ✅ ADICIONADO
      ...(workflowIdVal ? { workflow: { id: workflowIdVal } } : {}),
    };

    if (typeof dto.documentacaoUrl === 'string')
      payload.documentacaoUrl = dto.documentacaoUrl;
    if (typeof dto.descricaoExecucao === 'string')
      payload.descricaoExecucao = dto.descricaoExecucao;

    const created = await this.svc.create(payload, actorId);

    return {
      ...created,
      workflowId: created?.workflow?.id ?? workflowIdVal ?? null,
    };
  }

  @Post('public')
  async createPublic(@Body() body: CreateOcorrenciaPublicDto, @Req() req: any) {
    const setorIdVal = Array.isArray((body as any).setorId)
      ? Number((body as any).setorId[0])
      : Number((body as any).setorId);
    if (!Number.isInteger(setorIdVal))
      throw new BadRequestException('setorId deve ser um inteiro');
    const setor = await this.setorRepo.findOne({
      where: { id: setorIdVal },
      relations: ['users'],
    });
    if (!setor) throw new NotFoundException('Setor não encontrado');

    const gestor = setor.users.find((u) => u.perfil === Perfil.GESTOR);
    if (!gestor)
      throw new BadRequestException('Gestor do setor não encontrado');

    let colaborador = await this.usersSvc.findOneByEmail(
      body.colaboradorNome + '@slack',
    );
    if (!colaborador) {
      colaborador = await this.usersSvc.create({
        nome: body.colaboradorNome,
        email: body.colaboradorNome + '@slack',
        senha: 'slack',
        perfil: Perfil.COLABORADOR,
      });
    }

    // Parse opcional de workflowId
    let workflowIdVal: number | undefined;
    if (typeof (body as any).workflowId !== 'undefined') {
      workflowIdVal = Array.isArray((body as any).workflowId)
        ? Number((body as any).workflowId[0])
        : Number((body as any).workflowId);
      if (!Number.isInteger(workflowIdVal)) {
        throw new BadRequestException('workflowId deve ser um inteiro');
      }
    }

    const actorId = req.user?.id as number | undefined;

    const payload: any = {
      titulo: body.titulo,
      descricao: body.descricao,
      colaborador,
      setor: { id: setor.id } as unknown as Setor,
      gestor,
      ...(typeof workflowIdVal === 'number'
        ? { workflow: { id: workflowIdVal } as any }
        : {}),
    };

    if (typeof body.documentacaoUrl === 'string')
      payload.documentacaoUrl = body.documentacaoUrl;
    if (typeof body.descricaoExecucao === 'string')
      payload.descricaoExecucao = body.descricaoExecucao;

    const created = await this.svc.create(payload, actorId);

    return {
      ...created,
      workflowId: created?.workflow?.id ?? workflowIdVal ?? null,
    };
  }

  @Get()
  async findAll(
    @Query('titulo') titulo?: string,
    @Query('setorId') setorId?: string,
    @Query('status') status?: string,
    @Query('order') order?: string,
    @Query('workflowId') workflowId?: string,
  ) {
    const sid = setorId ? Number(setorId) : undefined;
    const wfId = workflowId ? Number(workflowId) : undefined;
    const ocorrencias = await this.svc.findAll(
      titulo,
      sid,
      status,
      order,
      wfId,
    );

    // ✅ CORRIGIDO: Retornar com todas as relações
    return ocorrencias.map((ocorrencia: any) => ({
      ...ocorrencia,
      workflowId: ocorrencia.workflow?.id ?? null,
    }));
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/atribuir')
  atribuir(
    @Param('id') id: string,
    @Body() body: { colaboradorId: number },
    @Req() req: Request,
  ) {
    const actorId = (req as any).user?.id as number | undefined;
    const auto =
      (body as any).auto === true ||
      String((body as any).auto).toLowerCase() === 'true';
    if (auto) {
      return this.svc.atribuirAutomaticamente(+id, actorId);
    }
    const colaboradorIdVal = Array.isArray((body as any).colaboradorId)
      ? Number((body as any).colaboradorId[0])
      : Number((body as any).colaboradorId);
    if (!Number.isInteger(colaboradorIdVal))
      throw new BadRequestException('colaboradorId deve ser um inteiro');
    return this.svc.atribuirColaborador(
      +id,
      colaboradorIdVal,
      undefined,
      actorId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  mudarStatus(
    @Param('id') id: string,
    @Body() body: { status: Status },
    @Req() req: Request,
  ) {
    const actorId = (req as any).user?.id as number | undefined;
    return this.svc.mudarStatus(+id, body.status, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const actorId = (req as any).user?.id as number | undefined;
    return this.svc.remove(+id, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateOcorrenciaDto,
    @Req() req: Request,
  ) {
    const actorId = (req as any).user?.id as number | undefined;
    const payload: any = {};

    if (typeof body.titulo === 'string') payload.titulo = body.titulo;
    if (typeof body.descricao === 'string') payload.descricao = body.descricao;

    // campos adicionais
    if (typeof body.documentacaoUrl === 'string')
      payload.documentacaoUrl = body.documentacaoUrl;
    if (typeof body.descricaoExecucao === 'string')
      payload.descricaoExecucao = body.descricaoExecucao;

    if (typeof (body as any).setorId !== 'undefined') {
      const setorIdVal = Array.isArray((body as any).setorId)
        ? Number((body as any).setorId[0])
        : Number((body as any).setorId);
      if (!Number.isInteger(setorIdVal)) {
        throw new BadRequestException('setorId deve ser um inteiro');
      }
      payload.setorId = setorIdVal;
    }

    return this.svc.updateOcorrencia(+id, payload, actorId);
  }
}
