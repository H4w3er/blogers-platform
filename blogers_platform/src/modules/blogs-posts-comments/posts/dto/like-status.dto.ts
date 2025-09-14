import { IsEnum, MinLength } from "class-validator";
import { LikeStatus } from "../../likes/dto/update-like-status.dto";

const likeStatusEnum = {
  LIKE: "Like",
  DISLIKE: "Dislike",
  NONE: "None",
};

export class LikeStatusInputDto {
  @IsEnum(likeStatusEnum)
  @MinLength(4)
  likeStatus: LikeStatus;
}
