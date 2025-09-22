import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Session, SessionDocument, SessionModelType } from "../../domain/session.entity";
import { CreateSessionDto } from "../../dto/create-session.dto";

@Injectable()
export class SessionsFactory {

  constructor(
    @InjectModel(Session.name)
    private sessionModel: SessionModelType,
  ) {}
  async create(dto: CreateSessionDto): Promise<SessionDocument> {
    const session = this.createSessionInstance(dto);

    return session;
  }

  private createSessionInstance(dto: CreateSessionDto): SessionDocument {
    const session = this.sessionModel.createInstance({
      ip: dto.ip,
      title: dto.title,
      deviceId: dto.deviceId,
      userId: dto.userId,
    });
    return session;
  }
}