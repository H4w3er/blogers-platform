import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentModelType } from '../domain/comment.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CreateCommentDto, UpdateCommentDto } from '../dto/create-comment.dto';
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';
import { User } from '../../../user-accounts/domain/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentsModel: CommentModelType,
    private commentRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async createComment(dto: CreateCommentDto, postId: string, userId: string): Promise<string> {
    const user = await this.usersRepository.findOrNotFoundFail(userId)
    const comment = this.CommentsModel.createInstance({
      content: dto.content,
      commentatorInfo: {
        userId: userId,
        userLogin: user.login
      },
      createdAt: new Date().toISOString(),
      postId: postId,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'none',
      }
    });

    await this.commentRepository.save(comment);

    return comment._id.toString();
  }

  async updateComment(id: string, dto: UpdateCommentDto){
    const comment = await this.commentRepository.findOrNotFoundFail(id);
    comment.update(dto)
    await this.commentRepository.save(comment)
  }

  async deleteComment(id: string) {
    const comment = await this.commentRepository.findOrNotFoundFail(id);

    comment.makeDeleted();

    await this.commentRepository.save(comment);
  }
}
