import { Module } from '@nestjs/common';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsRepository } from './blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './blogs/infrastructure/blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { Post, PostSchema } from './posts/domain/post.entity';
import { PostsController } from './posts/api/posts.controller';
import { PostsService } from './posts/application/posts.service';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { PostsQueryRepository } from './posts/infrastructure/posts.query-repository';
import { LastLikes, LastLikesSchema } from './posts/domain/last-likes.entity';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CommentsService } from './comments/application/comments.service';
import { CommentsQueryRepository } from './comments/infrastructure/comments.query-repository';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsController } from './comments/api/comments.controller';
import { UsersAccountsModule } from '../user-accounts/users-accounts.module';
import { UsersRepository } from '../user-accounts/infrastructure/users.repository';
import { User, UserSchema } from '../user-accounts/domain/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: LastLikes.name, schema: LastLikesSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    UsersAccountsModule,

  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    UsersRepository,
  ],
})
export class BlogsPostsCommentsModule {}