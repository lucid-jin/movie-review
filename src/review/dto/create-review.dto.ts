import {IsEnum, IsInt, IsPositive, IsString, Max, Min} from "class-validator";

enum TargetType {
  'Movie'= 'movie',
  'Tv' = 'tv'
}

export class CreateReviewDto {
  @IsString()
  contents: string;

  @IsEnum(TargetType)
  targetType: 'movie' | 'tv'

  @IsInt()
  @IsPositive()
  targetId: number;

  @IsInt({})
  @Min(1)
  @Max(100)
  ratings: number;



}
