import { Injectable } from "@nestjs/common";
import { CreatePostDto, UpdatePostDto } from '../api/input-dto/create-post.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostModelType } from "../domain/post.entity";
import { PostsRepository } from "../infrastructure/posts.repository";
import { BlogsRepository } from "../../blogs/infrastructure/blogs.repository";
import { BlogDocument } from "../../blogs/domain/blog.entity";
import { UsersRepository } from '../../../user-accounts/infrastructure/users.repository';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
    private usersRepository: UsersRepository,
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
            addedAt: 'none',
            userId: "none",
            login: "none",
          },
        ],
      },
    });

    await this.postsRepository.save(post);

    return post._id.toString();
  }

  async updatePost(id: string, dto: UpdatePostDto){
    const post = await this.postsRepository.findOrNotFoundFail(id);
    post.update(dto)
    await this.postsRepository.save(post)
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.makeDeleted();

    await this.postsRepository.save(post);
  }

  async likeUnlikePost(likeStatus: string, postId: string, likerId: string){
    const post = this.postsRepository.findOrNotFoundFail(postId)
    const user = this.usersRepository.findOrNotFoundFail(likerId)

    if (likeStatus == 'like') {

    }
  }
}
