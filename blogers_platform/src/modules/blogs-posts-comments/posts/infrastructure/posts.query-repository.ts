import { Injectable, NotFoundException } from "@nestjs/common";
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { FilterQuery } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { Post, PostModelType } from "../domain/post.entity";
import { GetPostsQueryParams } from "../api/input-dto/get-posts-query-params.input-dto";
import { PostViewDto } from "../api/view-dto/posts.view-dto";
import { LastLikes, LastLikesModelType } from "../domain/last-likes.entity";
import { UserContextDto } from '../../../user-accounts/guards/dto/user-context.dto';
import {UserStatuses, UserStatusesModelType} from "../../likes/domain/user-statuses.entity";

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType,
    @InjectModel(LastLikes.name)
    private LastLikesModel: LastLikesModelType,
    @InjectModel(UserStatuses.name)
    private UserStatusesModel: UserStatusesModelType,
  ) {}

  async getAll(
    query: GetPostsQueryParams,
    blogId: string = "",
    user: UserContextDto = {id: ''},
  ): Promise<PaginatedViewDto<PostViewDto[]>> {

    const userId = user?.id

    const filter: FilterQuery<Post> = {
      deletedAt: null,
    };

    if (blogId != "") filter.blogId = blogId;

    if (query.searchTitleTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchTitleTerm, $options: "i" },
      });
    }
    if (query.searchShortDescriptionTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchShortDescriptionTerm, $options: "i" },
      });
    }
    if (query.searchContentTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchContentTerm, $options: "i" },
      });
    }
    if (query.searchBlogNameTerm) {
      filter.$or = filter.$or || [];
      filter.$or.push({
        name: { $regex: query.searchBlogNameTerm, $options: "i" },
      });
    }

    const posts = await this.PostModel.find(filter)
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.calculateSkip())
      .limit(query.pageSize);

    const postIds = posts.map(post => post._id.toString());
    
    const lastLikes = await this.LastLikesModel.find({
      postId: { $in: postIds }
    })
      .sort({ addedAt: -1 })
      .exec();

    const userStatuses = await this.UserStatusesModel.find({
      postOrCommentId: { $in: postIds },
      userId: userId,
      isDeleted: false,
    }).exec()


    const totalCount = await this.PostModel.countDocuments(filter);

    const items = posts.map((post) => PostViewDto.mapToView(post, lastLikes, userStatuses));

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getByIdOrNotFoundFail(postId: string, user: UserContextDto = {id:''}): Promise<PostViewDto> {
    const userId = user?.id

    const post = await this.PostModel.findOne({
      _id: postId,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException("post not found");
    }

    const newestLikes = await this.LastLikesModel.find({
      postId: postId
    })
      .sort({ addedAt: -1 })
      .limit(3)
      .exec();

    const userStatus = await this.UserStatusesModel.find({
      postOrCommentId: postId,
      userId: userId
    }).exec()

    return PostViewDto.mapToView(post, newestLikes, userStatus);
  }
}
