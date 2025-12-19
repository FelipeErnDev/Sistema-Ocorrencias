import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Ocorrencia } from 'src/ocorrencias/ocorrencia.entity';
import { User } from 'src/users/user.entity';
import { Status } from 'src/common/enums';

@Entity('subtarefas')
export class Subtarefa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ type: 'enum', enum: Status, default: Status.EM_ATRIBUICAO })
  status: Status;

  @ManyToOne(() => Ocorrencia, (o) => o.subtarefas, { onDelete: 'CASCADE' })
  ocorrencia: Ocorrencia;

  @ManyToOne(() => User, { nullable: true })
  responsavel: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
