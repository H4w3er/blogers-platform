import { Controller, Get, Param, Query } from '@nestjs/common';
import { GetCommentsQueryParams } from "./input-dto/get-comments-query-params.input-dto";
import { CommentViewDto } from "./view-dto/comments.view-dto";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { CommentsQueryRepository } from "../infrastructure/comments.query-repository";
import { CommentsService } from '../application/comments.service';

@Controller("comments")
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentService: CommentsService
  ) {}

  @Get()
  async getAll(
    @Query() query: GetCommentsQueryParams,
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    return this.commentsQueryRepository.getAll(query);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id);
  }
}
