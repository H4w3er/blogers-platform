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
import { JwtRefreshStrategy } from './guards/bearer/jwt-refresh.strategy';
import { UsersExternalService } from './application/users-external.service';
import { AuthController } from './api/auth.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { CreateUserUseCase } from './application/usecases/create-user.usecase';
import { UsersFactory } from './application/factories/users.factory';
import { RegisterUserUseCase } from './application/usecases/register-user.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import {
  SendConfirmationEmailWhenUserRegisteredEventHandler
} from '../notifications/send-conformation-email-when-user-registered.event-handler';
import { LoginUserUseCase } from './application/usecases/login-user.usecase';
import { NewRefreshTokenUseCase } from './application/usecases/new-refresh-token.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: 'access-token-secret',
      signOptions: { expiresIn: '5m' },
    }),
    NotificationsModule,
    CqrsModule.forRoot()
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
    JwtRefreshStrategy,
    UsersExternalService,
    CreateUserUseCase,
    UsersFactory,
    RegisterUserUseCase,
    SendConfirmationEmailWhenUserRegisteredEventHandler,
    LoginUserUseCase,
    NewRefreshTokenUseCase
  ],
  exports: [JwtStrategy, UsersExternalService],
})
export class UsersAccountsModule {}