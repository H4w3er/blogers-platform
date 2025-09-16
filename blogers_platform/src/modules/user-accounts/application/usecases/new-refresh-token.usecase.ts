import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import { UserContextDto } from "../../guards/dto/user-context.dto";

export class NewRefreshTokenCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(NewRefreshTokenCommand)
export class NewRefreshTokenUseCase implements ICommandHandler<NewRefreshTokenCommand> {
  constructor(private jwtService: JwtService) {}

  async execute({ refreshToken }: NewRefreshTokenCommand): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = this.jwtService.verify(refreshToken, { 
      secret: 'refresh-token-secret' 
    })

    const newAccessToken = this.jwtService.sign(
      { id: payload.id },
      { expiresIn: "10m" },
    );

    // Generate new refresh token
    const newRefreshToken = this.jwtService.sign(
      {
        id: payload.id,
        deviceId: payload.deviceId || "deviceId",
      } as UserContextDto,
      { 
        expiresIn: "24h",
        secret: 'refresh-token-secret'
      },
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
