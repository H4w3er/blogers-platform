import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UserContextDto } from "../../guards/dto/user-context.dto";
import { ExtractCookiesContextDto } from "../../guards/dto/extract-cookies.context.dto";
import { Session, SessionModelType } from '../../domain/session.entity';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

export class LoginUserCommand {
  constructor(
    public userDto: UserContextDto,
    public sessionDto: ExtractCookiesContextDto,
  ) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Session.name)
    private sessionModel: SessionModelType,
  ) {}

  async execute(dto: LoginUserCommand): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const deviceId = uuidv4()

    const accessToken = this.jwtService.sign(
      { id: dto.userDto.id } as UserContextDto,
      { expiresIn: "10m" },
    );
    const refreshToken = this.jwtService.sign(
      {
        id: dto.userDto.id,
        deviceId: deviceId,
      } as UserContextDto,
      {
        expiresIn: "24h",
        secret: "refresh-token-secret",
      },
    );

    const session = this.sessionModel.createInstance({
      ip: dto.sessionDto.ip,
      title: dto.sessionDto.title,
      deviceId: deviceId,
      userId: dto.userDto.id,
    });
    await session.save()

    return {
      accessToken,
      refreshToken,
    };
  }
}
