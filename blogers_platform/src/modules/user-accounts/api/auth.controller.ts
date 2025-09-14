import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
  Res,
} from "@nestjs/common";
import { UsersService } from "../application/users.service";
import { CreateUserInputDto } from "./input-dto/users.input-dto";
import { AuthService } from "../application/auth.service";
import { AuthQueryRepository } from "../infrastructure/auth.query-repository";
import { JwtAuthGuard } from "../guards/bearer/jwt-auth.guard";
import { MeViewDto } from "./view-dto/users.view-dto";
import { LocalAuthGuard } from "../guards/local/local-auth.guard";
import { UserContextDto } from "../guards/dto/user-context.dto";
import { ExtractUserFromRequest } from "../guards/decorators/param/extract-user-from-request.decorator";
import {
  EmailDto,
  NewPasswordDto,
  RegistrationConformationCodeDto,
} from "./input-dto/auth.input-dto";
import { Response } from "express";
import { CommandBus } from '@nestjs/cqrs';
import { RegisterUserCommand } from '../application/usecases/register-user.usecase';
import { LoginUserCommand } from '../application/usecases/login-user.usecase';
import { Cookies } from '../guards/decorators/param/extract-cookies-from-request.decorator';

@Controller("auth")
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("registration")
  registration(@Body() body: CreateUserInputDto): Promise<void> {
    return this.commandBus.execute(new RegisterUserCommand(body));
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @Res({ passthrough: true }) response: Response,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<{ accessToken: string }> {
    const accessRefreshToken = await this.commandBus.execute(new LoginUserCommand(user));
    response.cookie("refreshToken", accessRefreshToken.refreshToken, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: accessRefreshToken.accessToken };
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("registration-confirmation")
  registrationConfirmation(
    @Body() code: RegistrationConformationCodeDto,
  ): Promise<void> {
    return this.usersService.confirmEmail(code.code);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("password-recovery")
  passwordRecovery(@Body() email: EmailDto): Promise<void> {
    return this.usersService.emailRecovery(email.email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("new-password")
  newPassword(@Body() passInfo: NewPasswordDto): Promise<void> {
    return this.usersService.newPassword(passInfo);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("registration-email-resending")
  registrationResending(@Body() dto: EmailDto): Promise<void> {
    return this.usersService.emailResending(dto.email);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("refresh-token")
  refreshToken(@Cookies('refreshToken') refreshToken: string): string {
    console.log(refreshToken);
    return ''
  }
}
