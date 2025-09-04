import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCommentInputDto {
  @MaxLength(300)
  @MinLength(20)
  @IsString()
  content: string;
}

export class UpdateCommentInputDto {
  @MaxLength(300)
  @MinLength(20)
  @IsString()
  content: string;
}
