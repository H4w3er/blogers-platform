import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { JwtService } from "@nestjs/jwt";
import { UserContextDto } from "../../guards/dto/user-context.dto";

export class LoginUserCommand {
  constructor(public dto: UserContextDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(private jwtService: JwtService) {}

  async execute({ dto }: LoginUserCommand): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const accessToken = this.jwtService.sign(
      { id: dto.id } as UserContextDto,
      { expiresIn: "10m" },
    );
    const refreshToken = this.jwtService.sign(
      {
        id: dto.id,
        deviceId: "deviceId",
      } as UserContextDto,
      { expiresIn: "24h" },
    );
    return {
      accessToken,
      refreshToken,
    };
  }
}
