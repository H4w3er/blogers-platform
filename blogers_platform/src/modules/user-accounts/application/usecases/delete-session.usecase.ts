import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteSessionDomainDto } from '../../domain/dto/create-session.domain.dto';
import { SecurityDevicesQueryRepository } from '../../infrastructure/security-devices.query-repository';


export class DeleteSessionCommand {
  constructor(public dto: DeleteSessionDomainDto) {}
}


@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand, void>
{
  constructor(
    private securityDevicesQueryRepository: SecurityDevicesQueryRepository,
  ) {}

  async execute({ dto }: DeleteSessionCommand): Promise<void> {
    const session = await this.securityDevicesQueryRepository.getSessionByUserAndDeviceId(dto.userId, 'deviceId')
    if (!!session) {
      session.makeDeleted()
      console.log('successfully deleted');
      session.save()
    }
  }
}