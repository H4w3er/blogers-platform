import {InjectModel} from "@nestjs/mongoose";
import {Injectable, NotFoundException} from "@nestjs/common";
import {Post, PostDocument, PostModelType} from "../domain/post.entity";
import {LastLikesModelType} from '../domain/last-likes.entity';
import {UserStatusesModelType} from "../domain/user-statuses.entity";

@Injectable()
export class PostsRepository {
    constructor(
        @InjectModel(Post.name)
        private PostModel: PostModelType,
        private LastLikesModel: LastLikesModelType,
        private UserStatusesModel: UserStatusesModelType,
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

    async addLikeToPost(postId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({id: postId})
        if (!post) throw new NotFoundException({
            message: 'Post not found'
        })

        this.LastLikesModel.createInstance({
            userId: userId,
            login: userLogin,
            postId: postId,
        })
        const userStatus = this.UserStatusesModel.findOne({userId: userId, postOrCommentId: postId})
        if (!userStatus) {
            this.UserStatusesModel.createInstance({
                userId: userId,
                postOrCommentId: postId,
                userLogin: userLogin,
                userStatus: 'like',
            })
        } else {
            userStatus.userStatus = 'like'
        }

        post.addLike()
        await this.save(post)
    }

    async addDislikeToPost(postId: string) {
        const post = await this.PostModel.findOne({id: postId})
        if (!post) throw new NotFoundException({
            message: 'Post not found'
        })

        post.addDislike()
        await this.save(post)
    }

    async removeLikeToPost(postId: string, userId: string, userLogin: string) {
        const post = await this.PostModel.findOne({id: postId})
        if (!post) throw new NotFoundException({
            message: 'Post not found'
        })

        this.LastLikesModel.deleteOne({userId: userId, postId: postId, userLogin: userLogin})

        post.removeLike()
        await this.save(post)
    }

    async removeDislikeToPost(postId: string) {
        const post = await this.PostModel.findOne({id: postId})
        if (!post) throw new NotFoundException({
            message: 'Post not found'
        })

        post.removeDislike()
        await this.save(post)
    }
}
