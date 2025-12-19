import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Expose } from 'class-transformer';
import { Ocorrencia } from 'src/ocorrencias/ocorrencia.entity';

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number;

  @Column()
  @Expose()
  nome: string;

  @Column({ type: 'text', nullable: true })
  @Expose()
  descricao?: string;

  @OneToMany(() => Ocorrencia, (o) => o.workflow)
  ocorrencias: Ocorrencia[];
}
