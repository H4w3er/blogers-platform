import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserModelType } from "../domain/user.entity";
import { CreateUserDto, UpdateUserDto } from "../dto/create-user.dto";
import { UsersRepository } from "../infrastructure/users.repository";
import { Types } from "mongoose";
import { CryptoService } from "./crypto.service";
import { EmailService } from "../../notifications/email.service";
import { v4 as uuidv4 } from "uuid";
import {
  DomainException,
  Extension,
} from "../../../core/exceptions/domain-exceptions";
import { DomainExceptionCode } from "../../../core/exceptions/domain-exception-codes";
import { NewPasswordDto } from "../api/input-dto/auth.input-dto";
import { CreateUserInputDto } from '../api/input-dto/users.input-dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) {}

  async updateUser(id: string, dto: UpdateUserDto): Promise<string> {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.update(dto);

    await this.usersRepository.save(user);

    return user._id.toString();
  }

  async confirmEmail(code: string) {
    const user = await this.usersRepository.findByCode(code);
    if (!user || user.isEmailConfirmed)
      throw new BadRequestException({
        message: ["Code is invalid"],
      });

    user.setConfirmation();
    await this.usersRepository.save(user);
  }

  async emailRecovery(email: string) {
    const recoveryCode = uuidv4();

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.emailService
        .sendConfirmationEmail(email, recoveryCode)
        .catch(console.error);
    } else {
      user.recoveryCode = recoveryCode;
      await this.usersRepository.save(user);
      this.emailService
        .sendConfirmationEmail(email, recoveryCode)
        .catch(console.error);
    }
  }

  async newPassword(dto: NewPasswordDto) {
    const user = await this.usersRepository.findByRecoveryCode(
      dto.recoveryCode,
    );

    if (!user)
      throw new DomainException({
        code: DomainExceptionCode.BadRequest,
        message: "user not found",
      });

    user.passwordHash = await this.cryptoService.createPasswordHash(
      dto.newPassword,
    );

    await this.usersRepository.save(user);
  }

  async emailResending(email: string) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user)
      throw new BadRequestException({
        message: ["Email not found"],
      });

    if (user.isEmailConfirmed){
      throw new BadRequestException({
        message: ['Email already confirmed']
      })
    }

    const confirmCode = uuidv4();

    user.confirmationCode = confirmCode;
    await this.usersRepository.save(user);

    this.emailService
      .sendConfirmationEmail(email, confirmCode)
      .catch(console.error);
  }
}
