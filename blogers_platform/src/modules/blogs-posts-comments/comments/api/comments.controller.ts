import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { GetCommentsQueryParams } from "./input-dto/get-comments-query-params.input-dto";
import { CommentViewDto } from "./view-dto/comments.view-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { CommentsQueryRepository } from "../infrastructure/comments.query-repository";
import { CommentsService } from "../application/comments.service";
import { UpdateCommentInputDto } from "./input-dto/create-comment.input-dto";
import { JwtAuthGuard } from "../../../user-accounts/guards/bearer/jwt-auth.guard";
import { ExtractUserFromRequest } from "../../../user-accounts/guards/decorators/param/extract-user-from-request.decorator";
import { UserContextDto } from "../../../user-accounts/guards/dto/user-context.dto";
import { LikeStatusInputDto } from "../../posts/dto/like-status.dto";
import { CommandBus } from "@nestjs/cqrs";
import { JwtOptionalAuthGuard } from "../../../user-accounts/guards/bearer/jwt-optional-auth.guard";
import {UpdateLikeStatusCommand} from "../../likes/usecases/update-like-status.usecase";
import {
  ExtractUserIfExistsFromRequest
} from "../../../user-accounts/guards/decorators/param/extract-user-if-exist-from-request.decorator";

@Controller("comments")
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentService: CommentsService,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtOptionalAuthGuard)
  @Get()
  async getAll(
    @Query() query: GetCommentsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAll(query, '', user);
  }

  @UseGuards(JwtOptionalAuthGuard)
  @Get(":id")
  async getById(
    @Param("id") id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id, user);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateCommentById(
    @Param("id") id: string,
    @Body() body: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    await this.commentService.updateComment(id, body, user.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Put(":id/like-status")
  async updateCommentLikeStatus(
    @Param("id") commentId: string,
    @Body() body: LikeStatusInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    await this.commandBus.execute<UpdateLikeStatusCommand>(
      new UpdateLikeStatusCommand({
        newLikeStatus: body.likeStatus,
        userId: user.id,
        postOrCommentId: commentId,
      }),
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteCommentById(
    @Param("id") commentId: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    await this.commentService.deleteComment(commentId, user.id);
  }
}
