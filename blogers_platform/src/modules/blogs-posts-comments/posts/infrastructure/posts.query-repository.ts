import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginatedViewDto } from "../../../../core/dto/base.paginated.view-dto";
import { FilterQuery } from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { GetPostsQueryParams } from '../api/input-dto/get-posts-query-params.input-dto';
import { PostViewDto } from '../api/view-dto/posts.view-dto';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: PostModelType
  ) {}

  async getAll(
    query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const filter: FilterQuery<Post> = {
      deletedAt: null,
    };

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

    const totalCount = await this.PostModel.countDocuments(filter);

    const items = posts.map(PostViewDto.mapToView);

    return PaginatedViewDto.mapToView({
      items,
      totalCount,
      page: query.pageNumber,
      size: query.pageSize,
    });
  }

  async getByIdOrNotFoundFail(id: string): Promise<PostViewDto> {
    const post = await this.PostModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!post) {
      throw new NotFoundException('post not found');
    }

    return PostViewDto.mapToView(post);
  }
}
