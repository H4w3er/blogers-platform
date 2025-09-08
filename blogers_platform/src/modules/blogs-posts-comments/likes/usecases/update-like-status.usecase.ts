import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserStatuses, UserStatusesModelType } from '../domain/user-statuses.entity';
import { NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {LikeStatusUpdateDto} from "../dto/update-like-status.dto";
import {User, UserModelType} from "../../../user-accounts/domain/user.entity";
import {LikesRepository} from "../infrastructure/likes.repository";
import {Post, PostModelType} from "../../posts/domain/post.entity";
import {Comment, CommentModelType} from "../../comments/domain/comment.entity";


export class UpdateLikeStatusCommand {
  constructor(public dto: LikeStatusUpdateDto) {
  }
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusUseCase
  implements ICommandHandler<UpdateLikeStatusCommand, void> {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private likesRepository: LikesRepository,
    @InjectModel(UserStatuses.name)
    private UserStatusesModel: UserStatusesModelType,
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
  ) {
  }

  async execute({ dto }: UpdateLikeStatusCommand): Promise<void> {
    const { newLikeStatus, userId, postOrCommentId } = dto;

    const post = await this.PostModel.findOne({ _id: postOrCommentId });
    const comment = await this.CommentModel.findOne({ _id: postOrCommentId });
    if (!post && !comment)
      throw new NotFoundException({
        message: "not found",
      });

    let oldStatus = 'None';
    const userStatus = await this.UserStatusesModel.findOne({
      userId: userId,
      postOrCommentId: postOrCommentId,
    });
    if (!!userStatus) oldStatus = userStatus.userStatus;
    const user = await this.UserModel.findOne({ _id: userId });
    if (!user) throw new NotFoundException();

    const userLogin = user.login;
    await this.executeStatusChangeOperation(
      newLikeStatus,
      oldStatus,
      userId,
      userLogin,
      postOrCommentId,
    );
  }

  private async executeStatusChangeOperation(
    newStatus: string,
    oldStatus: string,
    userId: string,
    userLogin: string,
    postOrCommentId: string,
  ): Promise<void> {
    const operationKey = `${oldStatus}-${newStatus}`;
    const operations: Record<string, () => Promise<void>> = {
      'None-Like': () =>
        this.likesRepository.addLikeToEntity(postOrCommentId, userId, userLogin),
      'None-Dislike': () => this.likesRepository.addDislikeToEntity(postOrCommentId, userId, userLogin),
      'Like-None': () =>
        this.likesRepository.removeLikeToEntity(postOrCommentId, userId, userLogin),
      'Dislike-None': () => this.likesRepository.removeDislikeToEntity(postOrCommentId, userId, userLogin),
      'Dislike-Like': () =>
        this.likesRepository.switchDislikeToLike(postOrCommentId, userId, userLogin),
      'Like-Dislike': () =>
        this.likesRepository.switchLikeToDislike(postOrCommentId, userId, userLogin),
    };

    const operation = operations[operationKey];
    if (operation) {
      await operation();
    }
  }
}
