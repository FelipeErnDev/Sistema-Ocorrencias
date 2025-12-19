import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OcorrenciasModule } from './ocorrencias/ocorrencias.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SetoresModule } from './setores/setores.module';
import { SubtarefasModule } from './subtarefas/subtarefas.module';
import { AuditModule } from './audit/audit.module';
import { StatusModule } from './status/status.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { KanbanModule } from './kanban/kanban.module';

const envSchema = Joi.object({
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().port().required(),
  DATABASE_USER: Joi.string().required(),
  DATABASE_PASS: Joi.string().allow('').required(),
  DATABASE_NAME: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  SLACK_WEBHOOK_URL: Joi.string().uri().optional(),
  GENERIC_WEBHOOK_URL: Joi.string().uri().optional(),
  PORT: Joi.number().port().optional(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DATABASE_HOST'),
        port: config.getOrThrow<number>('DATABASE_PORT'),
        username: config.getOrThrow<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASS') ?? '',
        database: config.getOrThrow<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    OcorrenciasModule,
    NotificationsModule,
    StatusModule,
    WorkflowsModule,
    AuditModule,
    SetoresModule,
    SubtarefasModule,
    KanbanModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
