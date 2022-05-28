import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { SmsService } from './sms.service';
import { PostSmsDto } from './dto/post-sms.dto';
import { UserService } from '../user/user.service';
import { VerifySmsDto } from './dto/verify-sms.dto';
import { BcryptService } from '../util/bcrypt/bcrypt.service';

@Controller('sms')
export class SmsController {
  constructor(
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly bcryptService: BcryptService,
  ) {}

  @Post('/user')
  async sendSMS(@Body() { phoneNumber, email }: PostSmsDto) {
    const user = this.userService.findOne({
      email,
      phoneNumber,
    });

    if (!user) {
      throw new NotFoundException({
        message: `${phoneNumber} 과 ${email} 로 등록 된 이메일이 없습니다.`,
      });
    }

    try {
      const verificationNumber = await this.smsService.generateNumber(
        phoneNumber,
      );

      await this.smsService.sendSMS({ phoneNumber, verificationNumber });
      await this.smsService.remove({ phoneNumber, verificationNumber });

      return {
        message: 'ok',
      };
    } catch (e) {
      console.log(e);
      return {
        message: '알수 없는 에러입니다. 관리자에게 문의하세요',
      };
    }
  }

  @Post('/verify')
  async verify(@Body() { phoneNumber, number }: VerifySmsDto) {
    const verification = await this.smsService.findOne({
      number,
      phoneNumber,
    });
    if (!verification) {
      throw new NotFoundException({
        message: '번호가 일치 하지 않습니다.',
      });
    }
    if (verification.createdAt.getTime() + 1000 * 60 > Date.now()) {
      throw new HttpException(
        { message: '인증 번호가 만료 되었습니다' },
        HttpStatus.GONE,
      );
    }
    const token = await this.bcryptService.makeHash(number.toString());

    await this.smsService.save({
      ...verification,
      token,
    });

    return {
      message: 'ok',
      token,
    };
  }
}
