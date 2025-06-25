import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { BlogsService } from "../application/blogs.service";
import { GetBlogsQueryParams } from "./input-dto/get-blogs-query-params.input-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { BlogsQueryRepository } from "../infrastructure/blogs.query-repository";
import { BlogViewDto } from "./view-dto/blogs.view-dto";
import { CreateBlogInputDto } from "./input-dto/blogs.input-dto";
import { UpdateBlogDto } from "../dto/create-blog.dto";

@Controller("blogs")
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Post()
  async createBlog(@Body() body: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId = await this.blogsService.createBlog(body);
    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param("id") id: string): Promise<void> {
    return this.blogsService.deleteBlog(id);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param("id") id: string,
    @Body() body: UpdateBlogDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(id, body);
  }
}
