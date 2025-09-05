import {InjectModel} from "@nestjs/mongoose";
import {Injectable, NotFoundException} from "@nestjs/common";
import {Post, PostDocument, PostModelType} from "../domain/post.entity";
import {LastLikes, LastLikesModelType} from "../domain/last-likes.entity";
import {
    UserStatuses,
    UserStatusesModelType,
} from "../domain/user-statuses.entity";
import {Comment, CommentDocument, CommentModelType} from '../../comments/domain/comment.entity';

@Injectable()
export class PostsRepository {
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

    async findById(id: string): Promise<PostDocument | null> {
        return this.PostModel.findOne({
            _id: id,
            deletedAt: null,
        });
    }

    async save(post: PostDocument) {
        await post.save();
    }

    async findOrNotFoundFail(id: string): Promise<PostDocument> {
        const post = await this.findById(id);

        if (!post) {
            throw new NotFoundException("post not found");
        }

        return post;
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

    private async addOrRemoveLikeDislikeOnPostOrComment(comment: CommentDocument | null,post: PostDocument | null, postOrCommentId: string){
        if (!comment) {
            await this.PostModel.updateOne(
                {_id: postOrCommentId},
                {$inc: {"extendedLikesInfo.likesCount": 1}},
            );
        }
        if (!post) {
            await this.CommentModel.updateOne(
                {_id: postOrCommentId},
                {$inc: {"extendedLikesInfo.likesCount": 1}},
            );
        }
    }

    async addLikeToPost(postOrCommentId: string, userId: string, userLogin: string) {
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

        await this.addOrRemoveLikeDislikeOnPostOrComment(comment, post, postOrCommentId)
    }

    async addDislikeToPost(postOrCommentId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({_id: postOrCommentId});
        const comment = await this.CommentModel.findOne({_id: postOrCommentId});
        if (!post && !comment)
            throw new NotFoundException({
                message: "not found",
            });

        await this.createOrChangeUserStatus(postOrCommentId, userId, userLogin, "Dislike");

        await this.addOrRemoveLikeDislikeOnPostOrComment(comment, post, postOrCommentId)
    }

    async removeLikeToPost(postOrCommentId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({_id: postOrCommentId});
        const comment = await this.CommentModel.findOne({_id: postOrCommentId});
        if (!post && !comment)
            throw new NotFoundException({
                message: "not found",
            });

        await this.createOrChangeUserStatus(postOrCommentId, userId, userLogin, "None");

        this.LastLikesModel.deleteOne({
            userId: userId,
            postId: postOrCommentId,
            userLogin: userLogin,
        });

        await this.addOrRemoveLikeDislikeOnPostOrComment(comment, post, postOrCommentId)
    }

    async removeDislikeToPost(postOrCommentId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({_id: postOrCommentId});
        const comment = await this.CommentModel.findOne({_id: postOrCommentId});
        if (!post && !comment)
            throw new NotFoundException({
                message: "not found",
            });

        await this.createOrChangeUserStatus(postOrCommentId, userId, userLogin, "None");

        await this.addOrRemoveLikeDislikeOnPostOrComment(comment, post, postOrCommentId)
    }

    async switchDislikeToLike(postOrCommentId: string, userId: string, userLogin: string) {
        await this.removeDislikeToPost(postOrCommentId, userId, userLogin);
        await this.addLikeToPost(postOrCommentId, userId, userLogin);
    }

    async switchLikeToDislike(postOrCommentId: string, userId: string, userLogin: string) {
        await this.removeLikeToPost(postOrCommentId, userId, userLogin);
        await this.addDislikeToPost(postOrCommentId, userId, userLogin);
    }
}
