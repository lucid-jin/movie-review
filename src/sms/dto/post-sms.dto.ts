import { IsEmail, IsString } from 'class-validator';

export class PostSmsDto {
  @IsString()
  phoneNumber: string;

  @IsEmail()
  email: string;
}
