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
  UseGuards,
} from "@nestjs/common";
import { GetPostsQueryParams } from "./input-dto/get-posts-query-params.input-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { PostsQueryRepository } from "../infrastructure/posts.query-repository";
import { PostViewDto } from "./view-dto/posts.view-dto";
import { CreatePostDto, UpdatePostDto } from "../dto/create-post.dto";
import { PostsService } from "../application/posts.service";
import { CommentViewDto } from "../../comments/api/view-dto/comments.view-dto";
import { CommentsQueryRepository } from "../../comments/infrastructure/comments.query-repository";
import { GetCommentsQueryParams } from "../../comments/api/input-dto/get-comments-query-params.input-dto";
import { Public } from "../../../user-accounts/guards/decorators/public.decorator";
import { BasicAuthGuard } from "../../../user-accounts/guards/basic/basic-auth.guard";
import { CreateCommentDto } from "../../comments/dto/create-comment.dto";
import { CommentsService } from "../../comments/application/comments.service";
import {
  ExtractUserFromRequest
} from '../../../user-accounts/guards/decorators/param/extract-user-from-request.decorator';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import { JwtAuthGuard } from '../../../user-accounts/guards/bearer/jwt-auth.guard';
import { LikeStatusDto } from '../dto/like-status.dto';

@Controller("posts")
export class PostsController {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private postsService: PostsService,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
  ) {}

  @Get()
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param("id") id: string,
    @Body() body: UpdatePostDto,
  ): Promise<void> {
    return this.postsService.updatePost(id, body);
  }

  @UseGuards(BasicAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param("id") id: string): Promise<void> {
    return this.postsService.deletePost(id);
  }

  @Public()
  @Get(":id/comments")
  async getCommentsForPost(
    @Query() query: GetCommentsQueryParams,
    @Param("id") id: string,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAll(query, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/comments")
  async createCommentForPost(
    @Param("id") postId: string,
    @Body() body: CreateCommentDto,
    @ExtractUserFromRequest() user: UserContextDto
  ): Promise<CommentViewDto> {
    const commentId = await this.commentsService.createComment(body, postId, user.id);
    return this.commentsQueryRepository.getByIdOrNotFoundFail(commentId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Put(":id/like-status")
  async updateLikeStatus(
    @Param("id") postId: string,
    @Body() body: LikeStatusDto,
    @ExtractUserFromRequest() user: UserContextDto
  ): Promise<> {
    const like = await this.postsService.likeUnlikePost(body.likeStatus, postId, user.id);

  }
}
