import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query-repository';
import { JwtModule } from '@nestjs/jwt';
import { AuthQueryRepository } from './infrastructure/auth.query-repository';
import { AuthService } from './application/auth.service';
import { LocalStrategy } from './guards/local/local.strategy';
import { CryptoService } from './application/crypto.service';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import { UsersExternalService } from './application/users-external.service';
import { AuthController } from './api/auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'access-token-secret',
      signOptions: { expiresIn: '5m' },
    }),
    NotificationsModule
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthQueryRepository,
    AuthService,
    LocalStrategy,
    CryptoService,
    JwtStrategy,
    UsersExternalService,
  ],
  exports: [JwtStrategy, UsersExternalService],
})
export class UsersAccountsModule {}