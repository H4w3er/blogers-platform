import { Contains, IsString, MaxLength } from 'class-validator';

export class CreateBlogInputDto {
  @MaxLength(15)
  @IsString()
  name: string;

  @MaxLength(500)
  @IsString()
  description: string;

  @Contains('https')
  @MaxLength(100)
  @IsString()
  websiteUrl: string;
}

export class UpdateBlogInputDto {
  @MaxLength(15)
  @IsString()
  name: string;

  @MaxLength(500)
  @IsString()
  description: string;

  @Contains('https')
  @MaxLength(100)
  @IsString()
  websiteUrl: string;
}