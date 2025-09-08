import { Contains, IsString, MaxLength } from 'class-validator';
import {IsStringWithTrim} from "../../../../../core/decorators/is-string-with-trim";

export class CreateBlogInputDto {
  @IsStringWithTrim(1, 15)
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
  @IsStringWithTrim(1, 15)
  name: string;

  @MaxLength(500)
  @IsString()
  description: string;

  @Contains('https')
  @MaxLength(100)
  @IsString()
  websiteUrl: string;
}