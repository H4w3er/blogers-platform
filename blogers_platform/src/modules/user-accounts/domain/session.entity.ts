import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Error, HydratedDocument, Model } from 'mongoose';
import { CreateSessionDomainDto } from "./dto/create-session.domain.dto";

@Schema({ timestamps: true })
export class Session {
  @Prop({ type: String, required: true, })
  ip: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  lastActiveDate: string;

  @Prop({ type: String, required: true })
  deviceId: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  static createInstance(dto: CreateSessionDomainDto): SessionDocument {
    const session = new this();
    session.ip = dto.ip;
    session.title = dto.title;
    session.deviceId = dto.deviceId;
    session.userId = dto.userId;
    session.lastActiveDate = new Date().toISOString();
    session.deletedAt = null

    return session as SessionDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error("Entity already deleted");
    }
    this.deletedAt = new Date();
  }
}

export const SessionSchema = SchemaFactory.createForClass(Session);

SessionSchema.loadClass(Session);

export type SessionDocument = HydratedDocument<Session>;

export type SessionModelType = Model<SessionDocument> & typeof Session;
