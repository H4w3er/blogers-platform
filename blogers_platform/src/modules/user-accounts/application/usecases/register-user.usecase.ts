import { CreateUserDto } from "../../dto/create-user.dto";
import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { v4 as uuidv4 } from "uuid";
import { UsersFactory } from "../factories/users.factory";
import { UsersRepository } from "../../infrastructure/users.repository";
import { UserRegisteredEvent } from '../../domain/events/user-registered.event';

export class RegisterUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private usersFactory: UsersFactory,
    private usersRepository: UsersRepository,
    private eventBus: EventBus,
  ) {}

  async execute({ dto }: RegisterUserCommand): Promise<void> {
    const user = await this.usersFactory.create(dto);

    const confirmCode = uuidv4();

    user.setConfirmationCode(confirmCode);
    await this.usersRepository.save(user);

    this.eventBus.publish(new UserRegisteredEvent(user.email, confirmCode));
  }
}
