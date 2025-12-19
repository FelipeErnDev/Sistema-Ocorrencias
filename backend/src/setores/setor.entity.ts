import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { Ocorrencia } from 'src/ocorrencias/ocorrencia.entity';

@Entity('setores')
export class Setor {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  nome: string;

  @OneToMany(() => User, (user) => user.setor)
  users: User[];

  @OneToMany(() => Ocorrencia, (o) => o.setor)
  ocorrencias: Ocorrencia[];
}
