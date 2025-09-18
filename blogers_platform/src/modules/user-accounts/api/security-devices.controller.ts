import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtRefreshAuthGuard } from "../guards/bearer/jwt-refresh-auth.guard";
import { ExtractCookieFromRequest } from "../guards/decorators/param/extract-cookies-from-request.decorator";
import { ExtractCookiesContextDto } from "../guards/dto/extract-cookies.context.dto";
import { ExtractUserFromRequest } from "../guards/decorators/param/extract-user-from-request.decorator";
import { UserContextDto } from "../guards/dto/user-context.dto";
import { SecurityDevicesQueryRepository } from '../infrastructure/security-devices.query-repository';

@Controller("security")
export class SecurityDevicesController {
  constructor(private securityDevicesQueryRepository: SecurityDevicesQueryRepository) {}

  @UseGuards(JwtRefreshAuthGuard)
  @Get("devices")
  async getAllActiveSessions(
    @ExtractCookieFromRequest("refreshToken") dto: ExtractCookiesContextDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    return this.securityDevicesQueryRepository.getAll(user);
  }
}
