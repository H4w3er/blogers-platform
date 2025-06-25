import { Injectable } from '@nestjs/common';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogDto, UpdateBlogDto } from '../dto/create-blog.dto';


@Injectable()
export class BlogsService {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: BlogModelType,
    private BlogRepository: BlogsRepository,
  ) {
  }

  async createBlog(dto: CreateBlogDto): Promise<string> {
    const blog = this.BlogModel.createInstance({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });

    await this.BlogRepository.save(blog);

    return blog._id.toString();
  }

  async deleteBlog(id: string) {
    const blog = await this.BlogRepository.findOrNotFoundFail(id);

    blog.makeDeleted();

    await this.BlogRepository.save(blog);
  }

  async updateBlog(id: string, dto: UpdateBlogDto){
    const blog = await this.BlogRepository.findOrNotFoundFail(id);
    blog.update(dto)
    await this.BlogRepository.save(blog)
  }
}