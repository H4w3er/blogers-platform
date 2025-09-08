import { IsString, MinLength } from 'class-validator';
import {LikeStatus} from "../../likes/dto/update-like-status.dto";

export class LikeStatusInputDto {
  @IsString()
  @MinLength(4)
  likeStatus: LikeStatus;
}
