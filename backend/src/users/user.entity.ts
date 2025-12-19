import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude, Expose, Type } from 'class-transformer';
import { Setor } from 'src/setores/setor.entity';
import { Ocorrencia } from 'src/ocorrencias/ocorrencia.entity';
import { Perfil } from 'src/common/enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  nome: string;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Exclude()
  senhaHash: string;

  @Column({ type: 'enum', enum: Perfil })
  @Expose()
  perfil: Perfil;

  @ManyToOne(() => Setor, (setor) => setor.users, { nullable: true })
  @Expose()
  @Type(() => Setor)
  setor: Setor;

  @OneToMany(() => Ocorrencia, (o) => o.gestor)
  ocorrenciasGestor: Ocorrencia[];

  @OneToMany(() => Ocorrencia, (o) => o.colaborador)
  ocorrenciasColaborador: Ocorrencia[];

  @Column({ type: 'float', default: 1 })
  @Expose()
  peso: number;

  @Column({ type: 'int', array: true, default: [], nullable: true })
  @Expose()
  workflowIds: number[];
}
