import { IsString, MaxLength } from 'class-validator';
import {IsStringWithTrim} from "../../../../../core/decorators/is-string-with-trim";

export class CreatePostDto {
  @IsStringWithTrim(1, 30)
  title: string;

  @MaxLength(100)
  @IsString()
  shortDescription: string;

  @MaxLength(1000)
  @IsString()
  content: string;

  @IsString()
  blogId: string;
}

export class CreatePostForBlogDto {
  @MaxLength(30)
  @IsString()
  title: string;

  @MaxLength(100)
  @IsString()
  shortDescription: string;

  @MaxLength(1000)
  @IsString()
  content: string;
}

export class UpdatePostDto {
  @MaxLength(30)
  @IsString()
  title: string;

  @MaxLength(100)
  @IsString()
  shortDescription: string;

  @MaxLength(1000)
  @IsString()
  content: string;

  @IsString()
  blogId: string;
}