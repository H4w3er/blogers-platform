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
import {UsersService} from "../application/users.service";
import {CreateUserInputDto} from "./input-dto/users.input-dto";
import {AuthService} from "../application/auth.service";
import {AuthQueryRepository} from "../infrastructure/auth.query-repository";
import {JwtAuthGuard} from "../guards/bearer/jwt-auth.guard";
import {JwtRefreshAuthGuard} from "../guards/bearer/jwt-refresh-auth.guard";
import {MeViewDto} from "./view-dto/users.view-dto";
import {LocalAuthGuard} from "../guards/local/local-auth.guard";
import {UserContextDto} from "../guards/dto/user-context.dto";
import {ExtractUserFromRequest} from "../guards/decorators/param/extract-user-from-request.decorator";
import {
    EmailDto,
    NewPasswordDto,
    RegistrationConformationCodeDto,
} from "./input-dto/auth.input-dto";
import {Response} from "express";
import {CommandBus} from '@nestjs/cqrs';
import {RegisterUserCommand} from '../application/usecases/register-user.usecase';
import {LoginUserCommand} from '../application/usecases/login-user.usecase';
import {ExtractCookieFromRequest} from '../guards/decorators/param/extract-cookies-from-request.decorator';
import {NewRefreshTokenCommand} from '../application/usecases/new-refresh-token.usecase';
import {LogoutUserCommand} from "../application/usecases/logout-user.usecase";

@Controller("auth")
export class AuthController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
        private authQueryRepository: AuthQueryRepository,
        private commandBus: CommandBus,
    ) {
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post("registration")
    async registration(@Body() body: CreateUserInputDto): Promise<void> {
        return this.commandBus.execute(new RegisterUserCommand(body));
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalAuthGuard)
    async login(
        @Res({passthrough: true}) response: Response,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<{ accessToken: string }> {
        const accessRefreshToken = await this.commandBus.execute(new LoginUserCommand(user));
        response.cookie("refreshToken", accessRefreshToken.refreshToken, {
            httpOnly: true,
            secure: true,
        });
        return {accessToken: accessRefreshToken.accessToken};
    }

    @Get("me")
    @UseGuards(JwtAuthGuard)
    async me(@ExtractUserFromRequest() user: UserContextDto): Promise<MeViewDto> {
        return this.authQueryRepository.me(user.id);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post("registration-confirmation")
    async registrationConfirmation(
        @Body() code: RegistrationConformationCodeDto,
    ): Promise<void> {
        return this.usersService.confirmEmail(code.code);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post("password-recovery")
    async passwordRecovery(@Body() email: EmailDto): Promise<void> {
        return this.usersService.emailRecovery(email.email);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post("new-password")
    async newPassword(@Body() passInfo: NewPasswordDto): Promise<void> {
        return this.usersService.newPassword(passInfo);
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post("registration-email-resending")
    async registrationResending(@Body() dto: EmailDto): Promise<void> {
        return this.usersService.emailResending(dto.email);
    }

    @UseGuards(JwtRefreshAuthGuard)
    @HttpCode(HttpStatus.OK)
    @Post("refresh-token")
    async refreshToken(
        @Res({passthrough: true}) response: Response,
        @ExtractCookieFromRequest('refreshToken') refreshToken: string,
    ): Promise<{ accessToken: string }> {
        const tokens = await this.commandBus.execute(new NewRefreshTokenCommand(refreshToken));

        response.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
        });

        return {accessToken: tokens.accessToken};
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshAuthGuard)
    async logout(
        @Res({passthrough: true}) response: Response,
        @ExtractCookieFromRequest('refreshToken') refreshToken: string,
        @ExtractUserFromRequest() user: UserContextDto,
    ): Promise<{ accessToken: string }> {
        return this.commandBus.execute(new LogoutUserCommand(refreshToken, user));
    }
}
