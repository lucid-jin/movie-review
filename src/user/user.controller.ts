import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import {
  CreateIdentifyDto,
  CreateUserDto,
  CreateUserResponseDto,
  FindEmailDto,
  GlobalAPI,
  IdentifyResponseDto,
  UpdatePasswordDto,
} from './schema/user.schema';
import { BcryptService } from '../util/bcrypt/bcrypt.service';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { SmsService } from '../sms/sms.service';

@Controller('user')
@UsePipes(ZodValidationPipe)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
    private readonly smsService: SmsService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: '유저 성공시.',
    type: CreateUserResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: GlobalAPI,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const alreadyEmail = await this.userService.findOne({
      email: createUserDto.email,
      isValid: true,
    });

    const alreadyPhoneNumber = await this.userService.findOne({
      phoneNumber: createUserDto.phoneNumber,
      isValid: true,
    });

    const error = [];
    if (alreadyEmail) error.push('이미 사용중일 이메일 입니다');
    if (alreadyPhoneNumber) error.push('이미 사용중인 핸드폰 입니다');
    if (error.length) {
      throw new BadRequestException({
        messages: error,
      });
    }

    const hashPassword = await this.bcryptService.makeHash(
      createUserDto.password,
    );

    const { ...user } = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });

    return {
      message: 'ok',
      user,
    };
  }

  @Get('/email')
  async findEmail(@Query() { name, phoneNumber }: FindEmailDto) {
    const user = await this.userService.findOne({
      name,
      phoneNumber,
    });

    if (!user) {
      throw new NotFoundException({
        message: '존재 하지 않는 사용자 입니다',
      });
    }

    return {
      message: 'ok',
      email: user.email,
    };
  }

  @Get('identities')
  @ApiResponse({
    status: 200,
    description: '닉네임 체크',
    type: IdentifyResponseDto,
  })
  async identify(@Query() { value, type }: CreateIdentifyDto) {
    const user = await this.userService.findOne({
      [type]: value,
    });

    const isExistUser = !!user;

    return {
      message: !isExistUser
        ? '존재하지않는 이메일 입니다'
        : '이미 있는 이메일 입니다',
      isExist: isExistUser,
    };
  }

  @Patch('/password')
  async updatePassword(@Body() { token, password, email }: UpdatePasswordDto) {
    const user = await this.userService.findOne({
      email,
    });
    if (!user) {
      throw new NotFoundException({
        message: '존재하지 않는 사용자 이메일 입니다',
      });
    }
    const isAuth = await this.smsService.findOne({
      phoneNumber: user.phoneNumber,
      token,
    });

    if (!isAuth) {
      throw new ForbiddenException({
        message: '존재 하지 않는토큰입니다',
      });
    }
    user.password = await this.bcryptService.makeHash(password);

    const updateUser = await this.userService.update(user.id, user);
    delete updateUser.password;

    return {
      message: 'ok',
      user: updateUser,
    };
  }
}
