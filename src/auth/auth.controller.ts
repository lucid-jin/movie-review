import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { BcryptService } from '../util/bcrypt/bcrypt.service';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    const user = await this.userService.findOne({ email: payload.email });

    if (!user) {
      throw new BadRequestException({
        code: 3001,
        message: '이메일 혹은 비밀번호가 일치하지 않습니다.',
      });
    }

    const isOK = await this.bcryptService.compareHash(
      payload.password,
      user.password,
    );

    if (!isOK) {
      throw new BadRequestException({
        code: 3001,
        message: '이메일 혹은 비밀번호가 일치하지 않습니다.',
      });
    }

    const { accessToken } = await this.authService.login({
      name: user.name,
      id: user.id,
    });
    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;

    return {
      message: '로그인에 성공하였습니다.',
      accessToken,
      expireDateTime: new Date(Date.now() + 1000 * 60 + KR_TIME_DIFF),
    };
  }

  @Get('me')
  @UseGuards(AuthGuard())
  getProfile(@Request() req) {
    return {
      user: {
        ...req.user,
      },
    };
  }
}
