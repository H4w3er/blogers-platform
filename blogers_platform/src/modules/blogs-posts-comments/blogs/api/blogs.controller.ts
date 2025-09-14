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
  Query, UseGuards,
} from '@nestjs/common';
import { BlogsService } from "../application/blogs.service";
import { GetBlogsQueryParams } from "./input-dto/get-blogs-query-params.input-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { BlogsQueryRepository } from "../infrastructure/blogs.query-repository";
import { BlogViewDto } from "./view-dto/blogs.view-dto";
import { CreateBlogInputDto, UpdateBlogInputDto } from './input-dto/blogs.input-dto';
import { PostViewDto } from '../../posts/api/view-dto/posts.view-dto';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/input-dto/get-posts-query-params.input-dto';
import { CreatePostForBlogDto } from '../../posts/api/input-dto/create-post.dto';
import { BasicAuthGuard } from '../../../user-accounts/guards/basic/basic-auth.guard';
import { Public } from '../../../user-accounts/guards/decorators/public.decorator';
import {
  ExtractUserIfExistsFromRequest
} from '../../../user-accounts/guards/decorators/param/extract-user-if-exist-from-request.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { JwtOptionalAuthGuard } from '../../../user-accounts/guards/bearer/jwt-optional-auth.guard';

@Controller("blogs")
@UseGuards(BasicAuthGuard)
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Public()
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

  @Public()
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
    @Body() body: UpdateBlogInputDto,
  ): Promise<void> {
    return this.blogsService.updateBlog(id, body);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Public()
  @Get(":id/posts")
  async getPostsForBlog(
    @Query() query: GetPostsQueryParams,
    @Param("id") id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsService.findOrNotFindFail(id);
    return this.postsQueryRepository.getAll(query, id, user);
  }

  @Post(":id/posts")
  async createPostForBlog(@Body() body: CreatePostForBlogDto, @Param('id') id: string): Promise<PostViewDto> {
    const postId = await this.blogsService.createPostForBlog(body, id);
    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }
}
