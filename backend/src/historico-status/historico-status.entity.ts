import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Ocorrencia } from 'src/ocorrencias/ocorrencia.entity';
import { StatusEntity } from 'src/status/status.entity';

@Entity('historico_status')
export class HistoricoStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StatusEntity, { nullable: true })
  status: StatusEntity;

  @CreateDateColumn()
  dataHora: Date;

  @ManyToOne(() => Ocorrencia, (o) => o.historicos, { onDelete: 'CASCADE' })
  ocorrencia: Ocorrencia;
}
