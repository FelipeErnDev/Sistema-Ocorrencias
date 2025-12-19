import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

interface JwtRequest extends Request {
  user: {
    perfil: string;
    [key: string]: any;
  };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;
    const req = context.switchToHttp().getRequest<JwtRequest>();
    const user = req.user;
    if (!user) return false;
    return roles.includes(user.perfil);
  }
}
