import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Post, PostModelType } from '../../domain/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class LikePostCommand {
  constructor() {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase
  implements ICommandHandler<LikePostCommand, Types.ObjectId>
{
  constructor(
    @InjectModel(Post.name)
    private postModel: PostModelType,
    private postsRepository: PostsRepository,
  ) {}

  async execute(userId: string, userLogin: string, postId: string): Promise<void> {
    await this.postsRepository.updatePostLikesCount(postId, userId, userLogin);
    //await this.likeRepository.addToLastLikers(userId, userLogin, postId);
  }
}