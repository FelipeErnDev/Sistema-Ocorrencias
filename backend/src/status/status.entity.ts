import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('status')
export class StatusEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  chave: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ type: 'int', nullable: true })
  ordem: number | null;

  @Column({ nullable: true })
  workflowId: number;
}
