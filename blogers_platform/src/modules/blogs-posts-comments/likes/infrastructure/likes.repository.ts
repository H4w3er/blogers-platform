import {InjectModel} from "@nestjs/mongoose";
import {Injectable, NotFoundException} from "@nestjs/common";
import {
    UserStatuses,
    UserStatusesModelType
} from "../domain/user-statuses.entity";
import {Post, PostDocument, PostModelType} from "../../posts/domain/post.entity";
import {LastLikes, LastLikesDocument, LastLikesModelType} from "../../posts/domain/last-likes.entity";
import {Comment, CommentDocument, CommentModelType} from "../../comments/domain/comment.entity";


@Injectable()
export class LikesRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        @InjectModel(LastLikes.name)
        private LastLikesModel: LastLikesModelType,
        @InjectModel(UserStatuses.name)
        private UserStatusesModel: UserStatusesModelType,
        @InjectModel(Comment.name)
        private CommentModel: CommentModelType,
    ) {
    }

    async findById(userId: string, postOrCommentId: string): Promise<LastLikesDocument | null> {
        return this.LastLikesModel.findOne({
            userId: userId,
            postId: postOrCommentId,
            isDeleted: false,
        });
    }

    private async createOrChangeUserStatus(
        postId: string,
        userId: string,
        userLogin: string,
        status: string,
    ) {
        const userStatus = await this.UserStatusesModel.findOne({
            userId: userId,
            postOrCommentId: postId,
        });
        if (!userStatus) {
            const createdStatus = this.UserStatusesModel.createInstance({
                userId: userId,
                postOrCommentId: postId,
                userLogin: userLogin,
                userStatus: status,
            });
            await createdStatus.save();
        } else {
            userStatus.userStatus = status;
            await userStatus.save();
        }
    }

    private async addOrRemoveLikeDislikeOnEntity(comment: CommentDocument | null, post: PostDocument | null, postOrCommentId: string, action: string) {
        if (!comment) {
            switch (action) {
                case 'addLike':
                    await this.PostModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.likesCount": 1}},
                    );
                    break;
                case 'addDislike':
                    await this.PostModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.dislikesCount": 1}},
                    );
                    break;
                case 'removeLike':
                    await this.PostModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.likesCount": -1}},
                    );
                    break;
                case 'removeDislike':
                    await this.PostModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.dislikesCount": -1}},
                    );
                    break;
            }
        }
        if (!post) {
            switch (action) {
                case 'addLike':
                    await this.CommentModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.likesCount": 1}},
                    );
                    break;
                case 'addDislike':
                    await this.CommentModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.dislikesCount": 1}},
                    );
                    break;
                case 'removeLike':
                    await this.CommentModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.likesCount": -1}},
                    );
                    break;
                case 'removeDislike':
                    await this.CommentModel.updateOne(
                        {_id: postOrCommentId},
                        {$inc: {"extendedLikesInfo.dislikesCount": -1}},
                    );
                    break;
            }
        }
    }

    async addLikeToEntity(postOrCommentId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({_id: postOrCommentId});
        const comment = await this.CommentModel.findOne({_id: postOrCommentId});
        if (!post && !comment)
            throw new NotFoundException({
                message: "not found",
            });

        await this.createOrChangeUserStatus(postOrCommentId, userId, userLogin, "Like");

        const newLastLike = this.LastLikesModel.createInstance({
            userId: userId,
            login: userLogin,
            postId: postOrCommentId,
        });
        await newLastLike.save();

        await this.addOrRemoveLikeDislikeOnEntity(comment, post, postOrCommentId, 'addLike')
    }

    async addDislikeToEntity(postOrCommentId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({_id: postOrCommentId});
        const comment = await this.CommentModel.findOne({_id: postOrCommentId});
        if (!post && !comment)
            throw new NotFoundException({
                message: "not found",
            });

        await this.createOrChangeUserStatus(postOrCommentId, userId, userLogin, "Dislike");

        await this.addOrRemoveLikeDislikeOnEntity(comment, post, postOrCommentId, 'addDislike')
    }

    async removeLikeToEntity(postOrCommentId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({_id: postOrCommentId});
        const comment = await this.CommentModel.findOne({_id: postOrCommentId});
        if (!post && !comment)
            throw new NotFoundException({
                message: "not found",
            });

        await this.createOrChangeUserStatus(postOrCommentId, userId, userLogin, "None");

        const lastLikes = await this.findById(userId, postOrCommentId)
        lastLikes?.makeDeleted()
        lastLikes?.save()

        await this.addOrRemoveLikeDislikeOnEntity(comment, post, postOrCommentId, 'removeLike')
    }

    async removeDislikeToEntity(postOrCommentId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({_id: postOrCommentId});
        const comment = await this.CommentModel.findOne({_id: postOrCommentId});
        if (!post && !comment)
            throw new NotFoundException({
                message: "not found",
            });

        await this.createOrChangeUserStatus(postOrCommentId, userId, userLogin, "None");

        await this.addOrRemoveLikeDislikeOnEntity(comment, post, postOrCommentId, 'removeDislike')
    }

    async switchDislikeToLike(postOrCommentId: string, userId: string, userLogin: string) {
        await this.removeDislikeToEntity(postOrCommentId, userId, userLogin);
        await this.addLikeToEntity(postOrCommentId, userId, userLogin);
    }

    async switchLikeToDislike(postOrCommentId: string, userId: string, userLogin: string) {
        await this.removeLikeToEntity(postOrCommentId, userId, userLogin);
        await this.addDislikeToEntity(postOrCommentId, userId, userLogin);
    }
}
