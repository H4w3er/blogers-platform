import { CreateUserDto } from '../../dto/create-user.dto';

import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserModelType } from '../../domain/user.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CryptoService } from '../crypto.service';
import { UsersRepository } from '../../infrastructure/users.repository';

@Injectable()
export class UsersFactory {

  constructor(
    private readonly cryptoService: CryptoService,
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository
  ) {}
  async create(dto: CreateUserDto): Promise<UserDocument> {
    const userWithTheSameLogin = await this.usersRepository.findByLogin(
      dto.login,
    );
    if (!!userWithTheSameLogin) {
      throw new BadRequestException({
        code: 400,
        message: ["Login is not unique"],
      });
    }

    const userWithTheSameEmail = await this.usersRepository.findByEmail(
      dto.email,
    );
    if (!!userWithTheSameEmail) {
      throw new BadRequestException({
        code: 400,
        message: ["Email is not unique"],
      });
    }
    const passwordHash = await this.createPasswordHash(dto);
    const user = this.createUserInstance(dto, passwordHash);

    return user;
  }

  private async createPasswordHash(dto: CreateUserDto) {
    const passwordHash = await this.cryptoService.createPasswordHash(
      dto.password,
    );
    return passwordHash;
  }

  private createUserInstance(dto: CreateUserDto, passwordHash: string) {
    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      passwordHash: passwordHash,
    });
    return user;
  }
}