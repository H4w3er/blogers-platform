import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Error, HydratedDocument, Model} from 'mongoose';
import { CreatePostDomainDto } from './dto/create-post.domain.dto';
import { UpdatePostDto } from '../api/input-dto/create-post.dto';
import { ExtendedLikesInfo, ExtendedLikesInfoSchema } from './post-likes-info.schema';
import {LastLikes} from "./last-likes.entity";


@Schema({ timestamps: true })
export class Post {

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  shortDescription: string;

  @Prop({ type: String, required: true})
  content: string;

  @Prop({ type: String, required: true})
  blogId: string;

  @Prop({ type: String, required: true})
  blogName: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Prop({ type: ExtendedLikesInfoSchema })
  extendedLikesInfo: ExtendedLikesInfo;

  static createInstance(dto: CreatePostDomainDto): PostDocument {
    const post = new this();
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    post.blogName = dto.blogName;
    post.extendedLikesInfo = {
      likesCount: dto.extendedLikesInfo.likesCount,
      dislikesCount: dto.extendedLikesInfo.dislikesCount,
      myStatus: dto.extendedLikesInfo.myStatus,
      newestLikes: [
        {
          LastLikes
        },
      ],
    };

    post.deletedAt = null;
    return post as PostDocument;
  }

  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('Entity already deleted');
    }
    this.deletedAt = new Date();
  }

  update(dto: UpdatePostDto) {
    if (dto.title !== this.title) {
      this.title = dto.title;
    }
    if (dto.shortDescription !== this.shortDescription) {
      this.shortDescription = dto.shortDescription;
    }
    if (dto.content !== this.content) {
      this.content = dto.content;
    }
    if (dto.blogId !== this.blogId) {
      this.blogId = dto.blogId;
    }
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

//регистрирует методы сущности в схеме
PostSchema.loadClass(Post);

//Типизация документа
export type PostDocument = HydratedDocument<Post>;

//Типизация модели + статические методы
export type PostModelType = Model<PostDocument> & typeof Post;