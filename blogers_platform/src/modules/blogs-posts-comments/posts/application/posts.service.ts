import { Injectable } from "@nestjs/common";
import { CreatePostDto } from "../dto/create-post.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostModelType } from "../domain/post.entity";
import { PostsRepository } from "../infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { BlogDocument } from "../../blogs/domain/blog.entity";
import { Likes, LikesModelType } from "../../../../core/domain/likes.entity";

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostDto): Promise<string> {
    const blog: BlogDocument | null = await this.blogsRepository.findById(
      dto.blogId,
    );
    const post = this.PostModel.createInstance({
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog == null ? "null" : blog.name,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: "None",
        newestLikes: [
          {
            addedAt: new Date(),
            userId: "none",
            login: "none",
          },
        ],
      },
    });

    await this.postsRepository.save(post);

    return post._id.toString();
  }
}
