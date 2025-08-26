import { IsString, MaxLength} from 'class-validator';

export class CreateBlogInputDto {
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