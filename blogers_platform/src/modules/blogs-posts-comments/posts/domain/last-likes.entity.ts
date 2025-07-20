import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({
  _id: false,
})
export class LastLikes {
  @Prop({ type: String, required: true, default: 0 })
  addedAt: string;

  @Prop({ type: String, required: true, default: 0 })
  userId: string;

  @Prop({ type: String, required: true })
  login: string;
}

export const LastLikesSchema =
  SchemaFactory.createForClass(LastLikes);

LastLikesSchema.loadClass(LastLikes);

export type LastLikesDocument = HydratedDocument<LastLikes>;

export type LastLikesModelType = Model<LastLikesDocument> & typeof LastLikes;