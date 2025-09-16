import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {
    handleRequest(err, user) {
        if (err || !user) {
            throw new DomainException({
                code: DomainExceptionCode.Unauthorized,
                message: 'Unauthorized',
            });
        }
        return user;
    }
}