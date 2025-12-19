import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtarefa } from './subtarefa.entity';
import { SubtarefasService } from './subtarefas.service';
import { SubtarefasController } from './subtarefas.controller';
import { Ocorrencia } from '../ocorrencias/ocorrencia.entity';
import { User } from '../users/user.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Subtarefa, Ocorrencia, User]), AuditModule],
  providers: [SubtarefasService],
  controllers: [SubtarefasController],
  exports: [SubtarefasService],
})
export class SubtarefasModule {}
