import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { CreateLikesDomainDto } from "./dto/create-likesInfo.domain.dto";

@Schema({
  _id: false,
})
export class LastLikes {
  @Prop({ type: String, required: true })
  addedAt: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true })
  login: string;

  static createInstance(dto: CreateLikesDomainDto): LastLikesDocument {
    const likeInfo = new this();
    likeInfo.addedAt = new Date().toISOString();
    likeInfo.userId = dto.userId;
    likeInfo.login = dto.login;

    return likeInfo as LastLikesDocument;
  }
}

export const LastLikesSchema = SchemaFactory.createForClass(LastLikes);

LastLikesSchema.loadClass(LastLikes);

export type LastLikesDocument = HydratedDocument<LastLikes>;

export type LastLikesModelType = Model<LastLikesDocument> & typeof LastLikes;
