import { Type } from 'class-transformer';
import { IsEnum, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

//базовый класс для query параметров с пагинацией
export class BaseQueryParams {
  //для трансформации в number
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageNumber: number = 1;
  
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number = 10;
  
  @IsEnum(SortDirection)
  @Transform(({ value }) => value || SortDirection.Desc)
  sortDirection: SortDirection = SortDirection.Desc;

  calculateSkip() {
    return (this.pageNumber - 1) * this.pageSize;
  }
}