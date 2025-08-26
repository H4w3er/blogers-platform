import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { FilterQuery } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { GetCommentsQueryParams } from '../api/input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from '../api/view-dto/comments.view-dto';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,

  ) {}

  async getAll(
    query: GetCommentsQueryParams,
    postId: string = '',
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const filter: FilterQuery<Comment> = {
      deletedAt: null,
    };

    if (postId != '') filter.postId = postId

    console.log(filter);

    if (query.searchContentTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchContentTerm, $options: "i" },
      });
    }

    const comments = await this.CommentModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.CommentModel.countDocuments(filter);

    const items = comments.map(CommentViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getByIdOrNotFoundFail(id: string): Promise<CommentViewDto> {
    const post = await this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException('comment not found');
    }

    return CommentViewDto.mapToView(post);
  }

  /*async getCommentsByPostId(id: string, query: GetCommentsQueryParams): Promise<PaginatedViewDto<CommentViewDto[]>>{
    const filter: FilterQuery<Comment> = {
      postId: id,
      deletedAt: null,
    };

    if (query.searchContentTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchContentTerm, $options: "i" },
      });
    }

    const comments = await this.CommentModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const totalCount = await this.CommentModel.countDocuments(filter);

    const items = comments.map(CommentViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }*/
}
