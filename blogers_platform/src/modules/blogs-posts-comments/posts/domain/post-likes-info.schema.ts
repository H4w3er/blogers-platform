import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LastLikes, LastLikesSchema } from './last-likes.entity';
import {UserStatuses, UserStatusesSchema} from "./user-statuses.entity";

@Schema({
  _id: false,
})
export class ExtendedLikesInfo {
  @Prop({ type: Number, required: true, default: 0 })
  likesCount: number;

  @Prop({ type: Number, required: true, default: 0 })
  dislikesCount: number;

  @Prop({ type: String, required: true })
  myStatus: string;

  @Prop({ type: [LastLikesSchema] })
  newestLikes: LastLikes[];

  @Prop({ type: [UserStatusesSchema] })
  usersStatuses: UserStatuses[];
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);
