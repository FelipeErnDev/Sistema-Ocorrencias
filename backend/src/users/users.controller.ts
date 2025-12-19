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
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Perfil } from 'src/common/enums';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

type ReqWithUser = Request & { user?: { id?: number } };

@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    const actorId = (req as any).user?.id as number | undefined;
    return this.svc.create(createUserDto, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Get('workflows/list')
  async listWorkflows() {
    return this.svc.listWorkflows();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Get(':id/ocorrencias')
  async ocorrencias(@Param('id') id: string) {
    return this.svc.findOcorrenciasByUser(+id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Post(':id/delete-action')
  async deleteAction(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    const actorId = (req as any).user?.id as number | undefined;
    return this.svc.handleDeleteAction(+id, body, actorId);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    const actorId = (req as any).user?.id as number | undefined;
    return this.svc.remove(+id, actorId);
  }

  // ✅ CORRIGIDO: Usar any ou criar interface inline
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Patch(':id/peso')
  async updatePeso(
    @Param('id') id: string,
    @Body() body: { peso: number },
    @Req() req: ReqWithUser,
  ) {
    const actorId = req.user?.id;
    return this.svc.updatePeso(+id, body.peso, actorId);
  }

  // ✅ CORRIGIDO: Endpoint /me deve ser antes de /:id para evitar conflito de rotas
  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  async updateMe(
    @Body()
    body: {
      nome?: string;
      email?: string;
      senhaAtual?: string;
      senha?: string;
      setorId?: number;
    },
    @Req() req: ReqWithUser,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestException('Usuário não autenticado');
    }
    return this.svc.updateMe(userId, body);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: {
      nome?: string;
      email?: string;
      perfil?: string;
      peso?: number;
      setorId?: number;
    },
    @Req() req: ReqWithUser,
  ) {
    const userId = Number(id);
    // ✅ ADICIONADO: Validação de NaN
    if (isNaN(userId)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    const actorId = req.user?.id;
    return this.svc.updateUser(userId, body, actorId);
  }
}
