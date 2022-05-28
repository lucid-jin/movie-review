import { IsNumber, IsString } from 'class-validator';

export class VerifySmsDto {
  @IsString()
  phoneNumber: string;

  @IsNumber()
  number: number;
}
