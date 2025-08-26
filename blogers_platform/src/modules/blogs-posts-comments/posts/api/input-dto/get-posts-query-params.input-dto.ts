import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PostsSortBy } from './posts-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';



export class GetPostsQueryParams extends BaseQueryParams {
  @IsEnum(PostsSortBy)
  @Transform(({ value }) => value || PostsSortBy.CreatedAt)
  sortBy = PostsSortBy.CreatedAt;

  @IsOptional()
  @IsString()
  searchTitleTerm: string | null = null;

  @IsOptional()
  @IsString()
  searchShortDescriptionTerm: string | null = null;

  @IsOptional()
  @IsString()
  searchContentTerm: string | null = null;

  @IsOptional()
  @IsString()
  searchBlogNameTerm: string | null = null;
}