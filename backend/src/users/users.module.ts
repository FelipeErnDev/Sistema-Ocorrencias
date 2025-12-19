import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Setor } from '../setores/setor.entity';
import { Ocorrencia } from '../ocorrencias/ocorrencia.entity';
import { Subtarefa } from '../subtarefas/subtarefa.entity';
import { HistoricoStatus } from '../historico-status/historico-status.entity';
import { Workflow } from '../workflows/workflow.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Setor,
      Ocorrencia,
      Subtarefa,
      HistoricoStatus,
      Workflow,
    ]),
    AuditModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
