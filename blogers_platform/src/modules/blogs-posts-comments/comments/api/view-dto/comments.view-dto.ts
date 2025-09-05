import { CommentDocument } from '../../domain/comment.entity';
import { UserStatusesDocument } from '../../../posts/domain/user-statuses.entity';

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

  static mapToView(comment: CommentDocument, userStatuses: Array<UserStatusesDocument>): CommentViewDto {
    const dto = new CommentViewDto();

    const statusToCurrentComment = userStatuses.filter(status => status.postOrCommentId == comment._id.toString())

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
      myStatus: statusToCurrentComment[0]?.userStatus ?? 'None',
    };
    return dto;
  }

}