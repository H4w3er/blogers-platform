import { IsString } from "class-validator";

export class LikeStatusDto {
  @IsString()
  likeStatus: string;
}
