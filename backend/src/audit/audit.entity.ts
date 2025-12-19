import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  actorId: number | null;

  @Column()
  action: string;

  @Column()
  targetType: string;

  @Column({ type: 'int' })
  targetId: number;

  @CreateDateColumn()
  createdAt: Date;
}
