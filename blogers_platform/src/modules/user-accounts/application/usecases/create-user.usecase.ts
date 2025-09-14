import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UsersFactory } from '../factories/users.factory';
import { UsersRepository } from '../../infrastructure/users.repository';


export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}


@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, Types.ObjectId>
{
  constructor(
    private usersRepository: UsersRepository,
    private usersFactory: UsersFactory,
  ) {}

  async execute({ dto }: CreateUserCommand): Promise<Types.ObjectId> {
    const user = await this.usersFactory.create(dto);

    user.isEmailConfirmed = true;
    await this.usersRepository.save(user);

    return user._id;
  }
}