import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decorator';
import { Perfil } from 'src/common/enums';

@Controller('audit')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Perfil.ADMIN, Perfil.GESTOR)
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '50') {
    const p = Number(page) || 1;
    const l = Number(limit) || 50;
    return this.audit.findAll(p, l);
  }
}
