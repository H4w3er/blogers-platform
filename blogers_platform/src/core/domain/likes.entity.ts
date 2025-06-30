import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({timestamps: true, _id: false,})
export class Likes {
  @Prop({ type: String, required: true, default: 'None' })
  status: string

  @Prop({ type: String, required: true })
  authorId: string;

  @Prop({ type: String, required: true })
  parentId: string;

  createdAt: Date;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);

LikesSchema.loadClass(Likes);

export type LikesDocument = HydratedDocument<Likes>;

export type LikesModelType = Model<LikesDocument> & typeof Likes;