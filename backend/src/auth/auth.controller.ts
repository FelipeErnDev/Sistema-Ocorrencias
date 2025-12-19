import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private svc: AuthService,
    private usersSvc: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; senha: string }) {
    const user = await this.usersSvc.findOneByEmail(body.email);
    if (!user) throw new UnauthorizedException();
    const valid = await bcrypt.compare(body.senha, user.senhaHash);
    if (!valid) throw new UnauthorizedException();
    return this.svc.login(user);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.usersSvc.create(dto);
  }
}
