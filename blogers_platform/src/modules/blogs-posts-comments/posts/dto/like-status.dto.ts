import { IsString } from "class-validator";
import {LikeStatus} from "./update-like-status.dto";

export class LikeStatusInputDto {
  @IsString()
  likeStatus: LikeStatus;
}
