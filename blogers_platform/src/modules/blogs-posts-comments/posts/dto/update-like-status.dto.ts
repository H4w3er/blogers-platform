export type LikeStatus = 'Like' | 'Dislike' | 'None';

export interface LikeStatusUpdateDto {
    newLikeStatus: LikeStatus;
    userId: string;
    postId: string;
}