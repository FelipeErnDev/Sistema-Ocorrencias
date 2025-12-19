import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OcorrenciasController } from './ocorrencias.controller';
import { OcorrenciasService } from './ocorrencias.service';
import { Ocorrencia } from './ocorrencia.entity';
import { UsersModule } from '../users/users.module';
import { SetoresModule } from '../setores/setores.module';
import { HistoricoStatus } from '../historico-status/historico-status.entity';
import { Subtarefa } from '../subtarefas/subtarefa.entity';
import { User } from '../users/user.entity';
import { StatusEntity } from '../status/status.entity';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ocorrencia,
      HistoricoStatus,
      Subtarefa,
      User,
      StatusEntity,
    ]),
    UsersModule,
    SetoresModule,
    AuditModule,
    NotificationsModule,
  ],
  controllers: [OcorrenciasController],
  providers: [OcorrenciasService],
  exports: [OcorrenciasService],
})
export class OcorrenciasModule {}
