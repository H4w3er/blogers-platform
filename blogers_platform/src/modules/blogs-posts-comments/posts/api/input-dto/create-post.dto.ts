import { IsString, MaxLength } from 'class-validator';
import {IsStringWithTrim} from "../../../../../core/decorators/is-string-with-trim";

export class CreatePostDto {
  @IsStringWithTrim(1, 30)
  title: string;

  @IsStringWithTrim(1, 100)
  shortDescription: string;

  @IsStringWithTrim(1, 1000)
  content: string;

  @IsString()
  blogId: string;
}

export class CreatePostForBlogDto {
  @IsStringWithTrim(1, 30)
  title: string;

  @IsStringWithTrim(1, 100)
  shortDescription: string;

  @IsStringWithTrim(1, 1000)
  content: string;
}

export class UpdatePostDto {
  @IsStringWithTrim(1, 30)
  title: string;

  @IsStringWithTrim(1, 100)
  shortDescription: string;

  @IsStringWithTrim(1, 1000)
  content: string;

  @IsString()
  blogId: string;
}