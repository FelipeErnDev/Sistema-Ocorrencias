import { Controller, Post, Body, Get, Param, Patch, BadRequestException, NotFoundException, Query } from '@nestjs/common';
import { UseGuards, Delete, Req } from '@nestjs/common';
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
import { CreateOcorrenciaDto, CreateOcorrenciaPublicDto } from './dto/create-ocorrencia.dto';
import { UpdateOcorrenciaDto } from './dto/update-ocorrencia.dto';

@Controller('ocorrencias')
export class OcorrenciasController {
  constructor(
    private svc: OcorrenciasService,
    private usersSvc: UsersService,
    @InjectRepository(Setor) private setorRepo: Repository<Setor>,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateOcorrenciaDto,
    @Req() req: any,
  ) {
    // Normaliza e valida ids para garantir que não cheguem arrays/strings inválidas
    const setorIdVal = Array.isArray((dto as any).setorId)
      ? Number((dto as any).setorId[0])
      : Number((dto as any).setorId);
    if (!Number.isInteger(setorIdVal)) throw new BadRequestException('setorId deve ser um inteiro');
    const setor = await this.setorRepo.findOne({
      where: { id: setorIdVal },
      relations: ['users'],
    });
    if (!setor) throw new NotFoundException('Setor não encontrado');

    const gestor = setor.users.find((u) => u.perfil === Perfil.GESTOR);
    if (!gestor) throw new BadRequestException('Gestor do setor não encontrado');

    let colaborador: any = null;
    const auto = (dto as any).autoAtribuir === true || String((dto as any).autoAtribuir).toLowerCase() === 'true';
    if (auto) {
      colaborador = await this.svc.findLeastLoadedCollaboradorBySetor(setor.id);
      if (!colaborador) throw new NotFoundException('Nenhum colaborador elegível encontrado para o setor');
    } else {
      const colaboradorIdVal = Array.isArray((dto as any).colaboradorId)
        ? Number((dto as any).colaboradorId[0])
        : Number((dto as any).colaboradorId);
      if (!Number.isInteger(colaboradorIdVal)) throw new BadRequestException('colaboradorId deve ser um inteiro');
      colaborador = await this.usersSvc.findOne(colaboradorIdVal);
      if (!colaborador) throw new NotFoundException('Colaborador não encontrado');
    }

  const actorId = (req as any).user?.id as number | undefined;

    return this.svc.create(
      {
      titulo: dto.titulo,
      descricao: dto.descricao,
      gestor,
      colaborador,
        setor: ({ id: setor.id } as unknown) as Setor,
      },
      actorId,
    );
  }

  @Post('public')
  async createPublic(@Body() body: CreateOcorrenciaPublicDto, @Req() req: any) {
    const setorIdVal = Array.isArray((body as any).setorId)
      ? Number((body as any).setorId[0])
      : Number((body as any).setorId);
    if (!Number.isInteger(setorIdVal)) throw new BadRequestException('setorId deve ser um inteiro');
    const setor = await this.setorRepo.findOne({
      where: { id: setorIdVal },
      relations: ['users'],
    });
    if (!setor) throw new NotFoundException('Setor não encontrado');

    const gestor = setor.users.find((u) => u.perfil === Perfil.GESTOR);
    if (!gestor) throw new BadRequestException('Gestor do setor não encontrado');

  let colaborador = await this.usersSvc.findOneByEmail(body.colaboradorNome + '@slack');
    if (!colaborador) {
      colaborador = await this.usersSvc.create({
        nome: body.colaboradorNome,
        email: body.colaboradorNome + '@slack',
        senha: 'slack',
        perfil: Perfil.COLABORADOR,
      });
    }

  const actorId = (req as any).user?.id as number | undefined;

    return this.svc.create(
      {
      titulo: body.titulo,
      descricao: body.descricao,
      colaborador,
        setor: ({ id: setor.id } as unknown) as Setor,
        gestor,
      },
      actorId,
    );
  }

  @Get()
    findAll(
      @Query('titulo') titulo?: string,
      @Query('setorId') setorId?: string,
      @Query('status') status?: string,
      @Query('order') order?: string,
    ) {
      const sid = setorId ? Number(setorId) : undefined;
      return this.svc.findAll(titulo, sid, status, order);
    }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/atribuir')
  atribuir(@Param('id') id: string, @Body() body: { colaboradorId: number }, @Req() req: Request) {
    const actorId = (req as any).user?.id as number | undefined;
    const auto = (body as any).auto === true || String((body as any).auto).toLowerCase() === 'true';
    if (auto) {
      return this.svc.atribuirAutomaticamente(+id, actorId);
    }
    const colaboradorIdVal = Array.isArray((body as any).colaboradorId)
      ? Number((body as any).colaboradorId[0])
      : Number((body as any).colaboradorId);
    if (!Number.isInteger(colaboradorIdVal)) throw new BadRequestException('colaboradorId deve ser um inteiro');
    return this.svc.atribuirColaborador(+id, colaboradorIdVal, undefined, actorId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  mudarStatus(@Param('id') id: string, @Body() body: { status: Status }, @Req() req: Request) {
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
