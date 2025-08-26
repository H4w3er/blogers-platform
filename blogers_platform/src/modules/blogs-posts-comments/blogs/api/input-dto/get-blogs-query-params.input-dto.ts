import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { BlogsSortBy } from './blogs-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';


export class GetBlogsQueryParams extends BaseQueryParams {
  @IsEnum(BlogsSortBy)
  @Transform(({ value }) => value || BlogsSortBy.CreatedAt)
  sortBy = BlogsSortBy.CreatedAt;

  @IsOptional()
  @IsString()
  searchNameTerm: string | null = null;
}