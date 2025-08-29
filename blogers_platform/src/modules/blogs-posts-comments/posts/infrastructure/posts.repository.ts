import { InjectModel } from "@nestjs/mongoose";
import { Injectable, NotFoundException } from "@nestjs/common";
import { Post, PostDocument, PostModelType } from "../domain/post.entity";
import { LastLikesModelType } from '../domain/last-likes.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private LastLikesModel: LastLikesModelType,
  ) {}

  async findById(id: string): Promise<PostDocument | null> {
    return this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });
  }

  async save(post: PostDocument) {
    await post.save();
  }

  async findOrNotFoundFail(id: string): Promise<PostDocument> {
    const post = await this.findById(id);

    if (!post) {
      throw new NotFoundException("post not found");
    }

    return post;
  }

  async updatePostLikesCount(postId: string, userId: string, userLogin: string){
    const likesInfo = await this.LastLikesModel.findOne({})
  }
}
