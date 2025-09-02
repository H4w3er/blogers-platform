import {PostsRepository} from "../../infrastructure/posts.repository";
import {LikeStatusUpdateDto} from "../../dto/update-like-status.dto";
import {CommandHandler, ICommandHandler} from "@nestjs/cqrs";
import {UserStatusesModelType} from "../../domain/user-statuses.entity";
import {UserModelType} from "../../../../user-accounts/domain/user.entity";
import {NotFoundException} from "@nestjs/common";

export class UpdateLikeStatusCommand {
    constructor(
        public dto: LikeStatusUpdateDto
    ) {
    }
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusUseCase
    implements ICommandHandler<UpdateLikeStatusCommand> {
    constructor(
        private postsRepository: PostsRepository,
        private UserStatusesModel: UserStatusesModelType,
        private UserModel: UserModelType,
    ) {
    }

    async execute(dto: LikeStatusUpdateDto): Promise<void> {
        const {newLikeStatus, userId, postId} = dto
        let oldStatus = 'none'
        const userStatus = await this.UserStatusesModel.findOne({userId: userId, postId: postId})
        const user = await this.UserModel.findOne({userId: userId})
        if (!user) throw new NotFoundException()

        const userLogin = user.login

        if (!!userStatus) oldStatus = userStatus.userStatus

        await this.executeStatusChangeOperation(newLikeStatus, oldStatus, userId, userLogin, postId);
    }

    private async executeStatusChangeOperation(
        newStatus: string,
        oldStatus: string,
        userId: string,
        userLogin: string,
        postId: string
    ): Promise<void> {
        const operationKey = `${oldStatus}-${newStatus}`;

        const operations = {
            'None-Like': () => this.postsRepository.addLikeToPost(postId, userId, userLogin),
            'None-Dislike': () => this.postsRepository.addDislikeToPost(postId),
            'Like-None': () => this.postsRepository.removeLikeToPost(postId, userId, userLogin),
            'Dislike-None': () => this.postsRepository.removeDislikeToPost(postId),
            'Dislike-Like': () => {
                this.postsRepository.removeDislikeToPost(postId);
                this.postsRepository.addLikeToPost(postId, userId, userLogin)
            },
            'Like-Dislike': () => {
                this.postsRepository.removeLikeToPost(postId, userId, userLogin);
                this.postsRepository.addDislikeToPost(postId)
            },
        };

        const operation = operations[operationKey];
        if (operation) {
            await operation();
        }
    }
}