import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('optional-jwt') {
  handleRequest(err, user) {
    if (!user) {
      user.id = ''
    }
    return user;
  }
}