import { IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @MaxLength(15)
  @IsString()
  name: string;

  @MaxLength(500)
  @IsString()
  description: string;

  @MaxLength(100)
  @IsString()
  websiteUrl: string;
}

export class UpdateBlogDto {
  @MaxLength(15)
  @IsString()
  name: string;

  @MaxLength(500)
  @IsString()
  description: string;

  @MaxLength(100)
  @IsString()
  websiteUrl: string;
}