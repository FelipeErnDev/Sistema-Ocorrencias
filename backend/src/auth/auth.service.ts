import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { Perfil } from 'src/common/enums';

type AuthUser = {
  id: number;
  email: string;
  perfil: Perfil | string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersSvc: UsersService,
    private jwt: JwtService,
  ) {}

  async validateUser(email: string, senha: string) {
    const user = await this.usersSvc.findOneByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(senha, user.senhaHash);
    if (!match) return null;
    return { id: user.id, email: user.email, perfil: user.perfil };
  }

  login(user: AuthUser) {
    const payload: { sub: number; email: string; perfil: string } = {
      sub: user.id,
      email: user.email,
      perfil: String(user.perfil),
    };
    return { access_token: this.jwt.sign(payload) };
  }
}
