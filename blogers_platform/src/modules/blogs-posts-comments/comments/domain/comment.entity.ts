import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { LikesInfo, LikesInfoSchema } from './comments-likes-info.schema';
import { CreateCommentDomainDto } from './dto/create-comment.domain.dto';
import { HydratedDocument, Model } from 'mongoose';
import { UpdateCommentDto } from '../dto/create-comment.dto';


@Schema({ timestamps: true })
export class Comment {

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Object, required: true })
  commentatorInfo: {
    userId: string,
    userLogin: string
  }

  @Prop({ type: String, required: true })
  postId: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: LikesInfoSchema })
  likesInfo: LikesInfo;

  static createInstance(dto: CreateCommentDomainDto): CommentDocument {
    const comment = new this();
    comment.content = dto.content;
    comment.commentatorInfo = {
      userId: dto.commentatorInfo.userId,
      userLogin: dto.commentatorInfo.userLogin
    }
    comment.postId = dto.postId;
    comment.likesInfo = {
      likesCount: dto.likesInfo.likesCount,
      dislikesCount: dto.likesInfo.dislikesCount,
      myStatus: dto.likesInfo.myStatus,
      }

    comment.deletedAt = null;
    return comment as CommentDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  update(dto: UpdateCommentDto) {
    if (dto.content !== this.content) {
      this.content = dto.content;
    }
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

//регистрирует методы сущности в схеме
CommentSchema.loadClass(Comment);

//Типизация документа
export type CommentDocument = HydratedDocument<Comment>;

//Типизация модели + статические методы
export type CommentModelType = Model<CommentDocument> & typeof Comment;