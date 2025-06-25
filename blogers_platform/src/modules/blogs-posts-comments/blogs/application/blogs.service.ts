import { Injectable } from '@nestjs/common';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { CreateBlogInputDto } from '../api/input-dto/blogs.input-dto';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private BlogRepository: BlogsRepository,
  ) {
  }
  async createBlog(dto: CreateBlogInputDto): Promise<string> {
    const blog = this.BlogModel.createInstance({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });

    await this.BlogRepository.save(blog);

    return blog._id.toString();
  }
}