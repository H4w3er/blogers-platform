import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import {CreateUserStatusDomainDto} from "./dto/create-likesInfo.domain.dto";

@Schema()
export class UserStatuses {
  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  postOrCommentId: string;

  @Prop({ type: String, required: true })
  userLogin: string;

  @Prop({ type: String, required: true })
  userStatus: string;

  static createInstance(dto: CreateUserStatusDomainDto): UserStatusesDocument {
    const statusInfo = new this();
    statusInfo.userId = dto.userId;
    statusInfo.postOrCommentId = dto.postOrCommentId;
    statusInfo.userLogin = dto.userLogin;
    statusInfo.userStatus = dto.userStatus;

    return statusInfo as UserStatusesDocument;
  }
}

export const UserStatusesSchema = SchemaFactory.createForClass(UserStatuses);

UserStatusesSchema.loadClass(UserStatuses);

export type UserStatusesDocument = HydratedDocument<UserStatuses>;

export type UserStatusesModelType = Model<UserStatusesDocument> & typeof UserStatuses;
