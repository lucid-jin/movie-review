import {IsNumberString} from 'class-validator';

export class FindAllParams {
  @IsNumberString()
  reviewNo: number;

}
