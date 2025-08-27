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
import { GetPostsQueryParams } from "./input-dto/get-posts-query-params.input-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { PostsQueryRepository } from "../infrastructure/posts.query-repository";
import { PostViewDto } from "./view-dto/posts.view-dto";
import { CreatePostDto, UpdatePostDto } from '../dto/create-post.dto';
import { PostsService } from "../application/posts.service";
import { CommentViewDto } from '../../comments/api/view-dto/comments.view-dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/comments.query-repository';
import { GetCommentsQueryParams } from '../../comments/api/input-dto/get-comments-query-params.input-dto';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { Public } from '../../../user-accounts/guards/decorators/public.decorator';

@Controller("posts")
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private commentsQueryRepository: CommentsQueryRepository
  ) {}

  @Public()
  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

  @Post()
  async createPost(@Body() body: CreatePostDto): Promise<PostViewDto> {
    const postId = await this.postsService.createPost(body);
    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Public()
  @Get(":id")
  async getById(@Param("id") id: string): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param("id") id: string,
    @Body() body: UpdatePostDto,
  ): Promise<void> {
    return this.postsService.updatePost(id, body);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param("id") id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }

  @Public()
  @Get(":id/comments")
  async getCommentsForPost(@Query() query: GetCommentsQueryParams, @Param("id") id: string): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAll(query, id);
  }
}
