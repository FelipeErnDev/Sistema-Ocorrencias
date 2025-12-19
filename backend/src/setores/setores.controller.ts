import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Req,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Setor } from './setor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { Perfil } from '../common/enums';
import { AuditService } from 'src/audit/audit.service';
import type { Request } from 'express';

type ReqWithUser = Request & { user?: { id?: number } };

@Controller('setores')
export class SetoresController {
  constructor(
    @InjectRepository(Setor) private repo: Repository<Setor>,
    private audit: AuditService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Post()
  async create(@Body() body: { nome: string }, @Req() req: ReqWithUser) {
    const setor = this.repo.create({ nome: body.nome });
    const saved = await this.repo.save(setor);
    try {
      const actorId = req.user?.id;
      await this.audit.log(actorId ?? null, 'create_setor', 'setor', saved.id);
    } catch {
      // omit
    }
    return saved;
  }

  @Get()
  findAll() {
    return this.repo.find();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: { nome?: string },
    @Req() req: ReqWithUser,
  ) {
    const setor = await this.repo.findOne({ where: { id: +id } });
    if (!setor) throw new NotFoundException('Setor não encontrado');
    if (body.nome !== undefined) setor.nome = body.nome;
    const saved = await this.repo.save(setor);
    try {
      const actorId = req.user?.id;
      await this.audit.log(actorId ?? null, 'update_setor', 'setor', saved.id);
    } catch {
      // omit
    }
    return saved;
  }

  // ✅ CORRIGIDO: Adicionar validação antes de deletar
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: ReqWithUser) {
    const setor = await this.repo.findOne({
      where: { id: +id },
      relations: ['users', 'ocorrencias'], // ✅ Carregar relações
    });
    if (!setor) throw new NotFoundException('Setor não encontrado');

    // ✅ Validar se há usuários vinculados
    if (setor.users && setor.users.length > 0) {
      throw new BadRequestException(
        `Não é possível deletar o setor. Existem ${setor.users.length} usuário(s) vinculado(s) a este setor.`,
      );
    }

    // ✅ Validar se há ocorrências vinculadas
    if (setor.ocorrencias && setor.ocorrencias.length > 0) {
      throw new BadRequestException(
        `Não é possível deletar o setor. Existem ${setor.ocorrencias.length} ocorrência(s) vinculada(s) a este setor.`,
      );
    }

    try {
      await this.repo.remove(setor);

      try {
        const actorId = req.user?.id;
        await this.audit.log(actorId ?? null, 'delete_setor', 'setor', +id);
      } catch {
        // omit
      }

      return { deleted: true };
    } catch (error: any) {
      throw new BadRequestException(
        `Erro ao deletar setor: ${error.message || 'Erro desconhecido'}`,
      );
    }
  }
}
