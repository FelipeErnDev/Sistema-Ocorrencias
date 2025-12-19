import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import { Setor } from './setores/setor.entity';
import { Ocorrencia } from './ocorrencias/ocorrencia.entity';
import { HistoricoStatus } from './historico-status/historico-status.entity';
import { Subtarefa } from './subtarefas/subtarefa.entity';
import 'dotenv/config';
import { Perfil } from './common/enums';

async function run() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT || 5432),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASS || '',
    database: process.env.DATABASE_NAME || 'postgres',
    entities: [User, Setor, Ocorrencia, HistoricoStatus, Subtarefa],
    synchronize: true,
  });
  await ds.initialize();
  const setorRepo = ds.getRepository(Setor);
  const userRepo = ds.getRepository(User);

  const setor = setorRepo.create({ nome: 'TI' });
  await setorRepo.save(setor);

  const senhaHash = bcrypt.hashSync('senhaadmin', 10);
  const admin = userRepo.create({
    nome: 'Admin',
    email: 'admin@local',
    senhaHash,
    perfil: Perfil.ADMIN,
    setor,
  });

  await userRepo.save(admin);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
