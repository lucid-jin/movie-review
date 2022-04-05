import {IsInt, IsPositive, IsString, Max, Min} from "class-validator";

export class CreateReviewDto {
  @IsString()
  contents: string;

  @IsInt()
  @IsPositive()
  movieId: number;

  @IsInt({})
  @Min(1)
  @Max(100)
  ratings: number;



}
