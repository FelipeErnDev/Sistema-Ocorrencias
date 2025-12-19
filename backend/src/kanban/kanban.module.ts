import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KanbanController } from './kanban.controller';
import { KanbanService } from './kanban.service';
import { StatusEntity } from '../status/status.entity';
import { Ocorrencia } from '../ocorrencias/ocorrencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusEntity, Ocorrencia])],
  controllers: [KanbanController],
  providers: [KanbanService],
})
export class KanbanModule {}
