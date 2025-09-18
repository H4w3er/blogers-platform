import { Injectable } from '@nestjs/common';
import { Session, SessionModelType } from '../domain/session.entity';
import { SessionViewDto } from '../api/view-dto/sessions.view-dto';
import { UserContextDto } from '../guards/dto/user-context.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(Session.name)
    private sessionModel: SessionModelType
  ) {}

  async getAll(userId: UserContextDto): Promise<SessionViewDto[]> {
    const filter = {
      userId: userId.id,
      deletedAt: null,
    };

    const sessions = await this.sessionModel.find(filter)
    return sessions.map(SessionViewDto.mapToView);
  }

  async getSessionByUserAndDeviceId(userId: string, deviceId: string){
    return this.sessionModel.findOne({userId: userId, deviceId: deviceId})
  }
}