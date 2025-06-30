import { PostDocument } from "../../domain/post.entity";

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
    newestLikes: [
      {
        addedAt: Date;
        userId: string;
        login: string;
      },
    ];
  };

  static mapToView(post: PostDocument): PostViewDto {
    const dto = new PostViewDto();

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
      myStatus: post.extendedLikesInfo.myStatus,
      newestLikes: [
        {
          addedAt: post.extendedLikesInfo.newestLikes[0].addedAt,
          userId: post.extendedLikesInfo.newestLikes[0].userId,
          login: post.extendedLikesInfo.newestLikes[0].login,
        },
      ],
    };
    return dto;
  }
}
