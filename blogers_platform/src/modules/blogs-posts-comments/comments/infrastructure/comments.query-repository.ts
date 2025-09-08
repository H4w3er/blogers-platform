import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { FilterQuery } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../domain/comment.entity';
import { GetCommentsQueryParams } from '../api/input-dto/get-comments-query-params.input-dto';
import { CommentViewDto } from '../api/view-dto/comments.view-dto';
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import {UserStatuses, UserStatusesModelType} from "../../likes/domain/user-statuses.entity";

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: CommentModelType,
    @InjectModel(UserStatuses.name)
    private UserStatusesModel: UserStatusesModelType
  ) {}

  async getAll(
    query: GetCommentsQueryParams,
    postId: string = '',
    user: UserContextDto = {id: ''},
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const filter: FilterQuery<Comment> = {
      deletedAt: null,
    };

    const userId = user?.id
    if (postId != '') filter.postId = postId

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

    const commentsIds = comments.map(comment => comment._id.toString());

    const userStatuses = await this.UserStatusesModel.find({
      postOrCommentId: { $in: commentsIds },
      userId: userId
    }).exec()

    const totalCount = await this.CommentModel.countDocuments(filter);

    const items = comments.map((comment) => CommentViewDto.mapToView(comment, userStatuses));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getByIdOrNotFoundFail(commentId: string, user: UserContextDto): Promise<CommentViewDto> {
    const userId = user?.id

    const comment = await this.CommentModel.findOne({
      _id: commentId,
      deletedAt: null,
    });

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    const userStatus = await this.UserStatusesModel.find({
      postOrCommentId: commentId,
      userId: userId
    }).exec()

    return CommentViewDto.mapToView(comment, userStatus);
  }
}
