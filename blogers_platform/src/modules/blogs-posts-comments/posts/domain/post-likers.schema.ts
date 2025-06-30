import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

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

  @Prop({ type: Array, required: true })
  newestLikes: [
    {
      addedAt: Date;
      userId: string;
      login: string;
    },
  ];
}

export const ExtendedLikesInfoSchema =
  SchemaFactory.createForClass(ExtendedLikesInfo);

/*"extendedLikesInfo": {
    "likesCount": 0,
    "dislikesCount": 0,
    "myStatus": "None",
    "newestLikes": [
      {
        "addedAt": "2025-06-30T10:43:34.106Z",
        "userId": "string",
        "login": "string"
      }
    ]
  }*/
/*likesSchema = new Schema(
  createdAt: {type: Date, required: true},
  status: {type: LikeStatus, required: true},
  authorId: {type: String, required: true},
  parentId: {type: String, required: true}, // commentId, postId, etc..
)*/