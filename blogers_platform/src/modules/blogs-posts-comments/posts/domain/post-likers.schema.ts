import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { LastLikesSchema } from './last-likes.entity';
import { LastLikers } from '../../../../../dist/modules/blogs-posts-comments/posts/domain/post-likers.schema';



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

  @Prop({ type: LastLikesSchema })
  newestLikes: [
    LastLikers
  ];
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);