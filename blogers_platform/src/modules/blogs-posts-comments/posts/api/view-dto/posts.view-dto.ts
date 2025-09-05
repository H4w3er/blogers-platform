import { PostDocument } from "../../domain/post.entity";
import { LastLikesDocument } from "../../domain/last-likes.entity";
import { UserStatusesDocument } from '../../domain/user-statuses.entity';

export class PostViewDto {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: {
      addedAt: string;
      userId: string;
      login: string;
    }[];
  };

  static mapToView(
    post: PostDocument,
    newestLikes: Array<LastLikesDocument>,
    userStatuses: Array<UserStatusesDocument>,
  ): PostViewDto {
    const dto = new PostViewDto();
    
    const postLikes = newestLikes
      .filter(like => like.postId === post._id.toString())
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, 3)
      .map(like => ({
        addedAt: like.addedAt,
        userId: like.userId,
        login: like.login
      }));

    const statusToCurrentPost = userStatuses.filter(status => status.postOrCommentId == post._id.toString())
    
    dto.id = post._id.toString();
    dto.title = post.title;
    dto.shortDescription = post.shortDescription;
    dto.content = post.content;
    dto.blogId = post.blogId;
    dto.blogName = post.blogName;
    dto.createdAt = post.createdAt;
    dto.extendedLikesInfo = {
      likesCount: post.extendedLikesInfo.likesCount,
      dislikesCount: post.extendedLikesInfo.dislikesCount,
      myStatus: statusToCurrentPost[0]?.userStatus ?? 'None',
      newestLikes: postLikes,
    };
    return dto;
  }
}
