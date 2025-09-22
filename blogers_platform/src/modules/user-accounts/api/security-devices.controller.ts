import { Controller, Delete, Get, UseGuards } from "@nestjs/common";
import { JwtRefreshAuthGuard } from "../guards/bearer/jwt-refresh-auth.guard";
import { ExtractUserFromRequest } from "../guards/decorators/param/extract-user-from-request.decorator";
import { UserContextDto } from "../guards/dto/user-context.dto";
import { SecurityDevicesQueryRepository } from "../infrastructure/security-devices.query-repository";
import { CommandBus } from "@nestjs/cqrs";
import { DeleteSessionCommand } from "../application/usecases/delete-session.usecase";

@Controller("security")
export class SecurityDevicesController {
  constructor(
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get("devices")
  async getAllActiveSessions(
    //@ExtractCookieFromRequest("refreshToken") dto: ExtractCookiesContextDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.securityDevicesQueryRepository.getAll(user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete("devices")
  async deleteAllOtherSessions(
    //@ExtractCookieFromRequest("refreshToken") dto: ExtractCookiesContextDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.commandBus.execute(new DeleteSessionCommand());
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Delete("devices")
  async deleteSessionByDeviceId(
    //@ExtractCookieFromRequest("refreshToken") dto: ExtractCookiesContextDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.securityDevicesQueryRepository.getAll(user);
  }
}
