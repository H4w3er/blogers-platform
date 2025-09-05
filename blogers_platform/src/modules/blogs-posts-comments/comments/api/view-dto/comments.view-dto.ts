import { CommentDocument } from '../../domain/comment.entity';

export class CommentViewDto {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string,
    userLogin: string
  }
  postId: string;
  createdAt: Date;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };

  static mapToView(comment: CommentDocument): CommentViewDto {
    const dto = new CommentViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.commentatorInfo.userId,
      userLogin: comment.commentatorInfo.userLogin
    };
    dto.createdAt = comment.createdAt;
    dto.likesInfo = {
      likesCount: comment.extendedLikesInfo.likesCount,
      dislikesCount: comment.extendedLikesInfo.dislikesCount,
      myStatus: comment.extendedLikesInfo.myStatus,
    };
    return dto;
  }

}