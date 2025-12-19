import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose, Type } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { Subtarefa } from 'src/subtarefas/subtarefa.entity';
import { HistoricoStatus } from 'src/historico-status/historico-status.entity';
import { StatusEntity } from 'src/status/status.entity';
import { Setor } from 'src/setores/setor.entity';
import { Workflow } from 'src/workflows/workflow.entity';

@Entity('ocorrencias')
export class Ocorrencia {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  titulo: string;

  @Column('text')
  @Expose()
  descricao: string;

  @ManyToOne(() => StatusEntity, { nullable: true })
  @Expose()
  @Type(() => StatusEntity)
  status: StatusEntity;

  @ManyToOne(() => User, (u) => u.ocorrenciasGestor, { nullable: true })
  @Expose()
  @Type(() => User)
  gestor: User;

  @ManyToOne(() => User, (u) => u.ocorrenciasColaborador, { nullable: false })
  @Expose()
  @Type(() => User)
  colaborador: User;

  @ManyToOne(() => Setor, (s) => s.ocorrencias, { nullable: true })
  @Expose()
  @Type(() => Setor)
  setor: Setor;

  @Column({ nullable: true })
  @Expose()
  documentacaoUrl: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  descricaoExecucao: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Subtarefa, (s) => s.ocorrencia, { cascade: true })
  subtarefas: Subtarefa[];

  @OneToMany(() => HistoricoStatus, (h) => h.ocorrencia, { cascade: true })
  historicos: HistoricoStatus[];

  @ManyToOne(() => Workflow, (workflow) => workflow.ocorrencias, {
    nullable: true,
  })
  @Expose()
  @Type(() => Workflow)
  workflow: Workflow;
}
