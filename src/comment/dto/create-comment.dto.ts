import {IsInt, IsPositive, IsString} from "class-validator";

export class CreateCommentDto {
  @IsInt()
  @IsPositive()
  reviewNo: number;

  @IsString()
  contents: string;
}
