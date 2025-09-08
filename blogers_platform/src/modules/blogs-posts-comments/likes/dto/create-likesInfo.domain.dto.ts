export class CreateLikesDomainDto {
   userId: string;
   postId: string;
   login: string;
 }

export class CreateUserStatusDomainDto {
    userId: string;
    postOrCommentId: string;
    userLogin: string;
    userStatus: string;
}