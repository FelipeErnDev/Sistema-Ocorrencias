import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetoresController } from './setores.controller';
import { Setor } from './setor.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Setor]), AuditModule],
  controllers: [SetoresController],
  exports: [TypeOrmModule],
})
export class SetoresModule {}
