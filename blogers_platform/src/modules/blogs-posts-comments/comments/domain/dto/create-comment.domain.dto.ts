export class CreateCommentDomainDto {
  content: string;
  commentatorInfo: {
    userId: string,
    userLogin: string
  };
  createdAt: string;
  postId: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  }
}
