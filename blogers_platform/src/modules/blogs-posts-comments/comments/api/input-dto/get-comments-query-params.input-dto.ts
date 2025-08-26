import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { CommentsSortBy } from './comments-sort-by';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';


export class GetCommentsQueryParams extends BaseQueryParams {
  @IsEnum(CommentsSortBy)
  @Transform(({ value }) => value || CommentsSortBy.CreatedAt)
  sortBy = CommentsSortBy.CreatedAt;

  @IsOptional()
  @IsString()
  searchContentTerm: string | null = null;
}