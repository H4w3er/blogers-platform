import { Injectable } from "@nestjs/common";
import { Blog, BlogDocument, BlogModelType } from '../domain/blog.entity';
import { BlogsRepository } from "../infrastructure/blogs.repository";
import { InjectModel } from "@nestjs/mongoose";
import { CreateBlogDto, UpdateBlogDto } from "../dto/create-blog.dto";
import {
  CreatePostDto,
  CreatePostForBlogDto,
} from "../../posts/api/input-dto/create-post.dto";
import { PostsService } from "../../posts/application/posts.service";

@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private blogRepository: BlogsRepository,
    private postsService: PostsService,
  ) {}

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const blog = this.BlogModel.createInstance({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });

    await this.blogRepository.save(blog);

    return blog._id.toString();
  }

  async deleteBlog(id: string) {
    const blog = await this.blogRepository.findOrNotFoundFail(id);

    blog.makeDeleted();

    await this.blogRepository.save(blog);
  }

  async updateBlog(id: string, dto: UpdateBlogDto) {
    const blog = await this.blogRepository.findOrNotFoundFail(id);
    blog.update(dto);
    await this.blogRepository.save(blog);
  }

  async createPostForBlog(dto: CreatePostForBlogDto, id: string): Promise<string> {
    const dtoForCreate: CreatePostDto = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: id,
    };
    await this.blogRepository.findOrNotFoundFail(id);
    return this.postsService.createPost(dtoForCreate);
  }

  async findOrNotFindFail(blogId: string):Promise<BlogDocument> {
    return this.blogRepository.findOrNotFoundFail(blogId)
  }
}
