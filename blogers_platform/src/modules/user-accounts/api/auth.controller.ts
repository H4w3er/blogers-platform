import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { UsersService } from "../application/users.service";
import { CreateUserInputDto } from "./input-dto/users.input-dto";
import { AuthService } from "../application/auth.service";
import { AuthQueryRepository } from "../infrastructure/auth.query-repository";
import { JwtAuthGuard } from '../guards/bearer/jwt-auth.guard';
import { MeViewDto } from './view-dto/users.view-dto';
import { LocalAuthGuard } from '../guards/local/local-auth.guard';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../guards/decorators/param/extract-user-from-request.decorator';
import {
  EmailDto,
  NewPasswordDto,
  RegistrationConformationCodeDto,
} from './input-dto/auth.input-dto';

@Controller("auth")
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private authQueryRepository: AuthQueryRepository,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("registration")
  registration(@Body() body: CreateUserInputDto): Promise<void> {
    return this.usersService.registerUser(body);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  login(
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.login(user.id);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
    return this.authQueryRepository.me(user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post("registration-confirmation")
  registrationConfirmation(@Body() code: RegistrationConformationCodeDto): Promise<void> {
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
}