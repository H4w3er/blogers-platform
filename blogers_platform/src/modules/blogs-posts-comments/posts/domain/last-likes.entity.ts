import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import {Error, HydratedDocument, Model} from "mongoose";
import { CreateLikesDomainDto } from "../../likes/dto/create-likesInfo.domain.dto";

@Schema()
export class LastLikes {
  @Prop({ type: String, required: true })
  addedAt: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  postId: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({type: Boolean, required: true})
  isDeleted: boolean;

  static createInstance(dto: CreateLikesDomainDto): LastLikesDocument {
    const likeInfo = new this();
    likeInfo.addedAt = new Date().toISOString();
    likeInfo.userId = dto.userId;
    likeInfo.postId = dto.postId;
    likeInfo.login = dto.login;
    likeInfo.isDeleted = false;
    return likeInfo as LastLikesDocument;
  }

  makeDeleted(){
    if (this.isDeleted) {
      throw new Error("Entity already deleted");
    }
    this.isDeleted = true;
  }
}

export const LastLikesSchema = SchemaFactory.createForClass(LastLikes);

LastLikesSchema.loadClass(LastLikes);

export type LastLikesDocument = HydratedDocument<LastLikes>;

export type LastLikesModelType = Model<LastLikesDocument> & typeof LastLikes;
