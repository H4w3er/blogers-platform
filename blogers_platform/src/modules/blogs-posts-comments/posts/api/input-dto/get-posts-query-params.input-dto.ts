import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PostsSortBy } from './posts-sort-by';



export class GetPostsQueryParams extends BaseQueryParams {
  sortBy = PostsSortBy.CreatedAt;
  searchTitleTerm: string | null = null;
  searchShortDescriptionTerm: string | null = null;
  searchContentTerm: string | null = null;
  searchBlogNameTerm: string | null = null;
}