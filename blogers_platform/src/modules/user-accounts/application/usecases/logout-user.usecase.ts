import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {JwtService} from "@nestjs/jwt";
import {UsersRepository} from "../../infrastructure/users.repository";
import {NotFoundException, UnauthorizedException} from "@nestjs/common";
import {UserContextDto} from "../../guards/dto/user-context.dto";

export class LogoutUserCommand {
    constructor(public refreshToken: string, public userDto: UserContextDto) {
    }
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
    constructor(private jwtService: JwtService, private usersRepository: UsersRepository) {
    }

    async execute( dto : LogoutUserCommand): Promise<void> {
        const user = await this.usersRepository.findById(dto.userDto.id)
        if (!user || user?.refreshTokenBlackList.includes(dto.refreshToken)){
            throw new UnauthorizedException()
        }
        await this.usersRepository.addToBlackList(dto.refreshToken, dto.userDto.id)
        await this.usersRepository.save(user)
    }
}
