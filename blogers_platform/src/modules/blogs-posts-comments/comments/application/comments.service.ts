import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comment, CommentModelType } from '../domain/comment.entity';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { CreateCommentDto, UpdateCommentDto } from '../dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentsModel: CommentModelType,
    private commentRepository: CommentsRepository,
  ) {}

  async createComment(dto: CreateCommentDto): Promise<string> {
    const comment = this.CommentsModel.createInstance({
      content: dto.content,
      commentatorInfo: {
        userId: '1',
        userLogin: 'first'
      },
      createdAt: '12',
      postId: 'some',
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
