import { CommandBus, CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../../infrastructure/users.repository';
import { UnauthorizedException } from '@nestjs/common';
import { UserContextDto } from '../../guards/dto/user-context.dto';
import { ExtractCookiesContextDto } from '../../guards/dto/extract-cookies.context.dto';
import { DeleteSessionCommand } from './delete-session.usecase';

export class LogoutUserCommand {
  constructor(
    public cookiesDto: ExtractCookiesContextDto,
    public userDto: UserContextDto,
  ) {
  }
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  constructor(
    private jwtService: JwtService,
    private usersRepository: UsersRepository,
    private commandBus: CommandBus,
  ) {
  }

  async execute(dto: LogoutUserCommand): Promise<void> {
    const user = await this.usersRepository.findById(dto.userDto.id);
    if (!user || user?.refreshTokenBlackList.includes(dto.cookiesDto.refreshToken)) {
      throw new UnauthorizedException();
    }
    await this.usersRepository.addToBlackList(dto.cookiesDto.refreshToken, dto.userDto.id);
    await this.usersRepository.save(user);

    await this.commandBus.execute(new DeleteSessionCommand({
      deviceId: dto.cookiesDto.refreshToken,
      userId: dto.userDto.id
    }));
  }
}
