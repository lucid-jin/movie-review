import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
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
  GlobalAPI,
  IdentifyResponseDto,
} from './schema/user.schema';
import { BcryptService } from '../util/bcrypt/bcrypt.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly bcryptService: BcryptService,
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
    const alreadyUser = await this.userService.findOne({
      email: createUserDto.email,
      isValid: true,
    });

    if (alreadyUser) {
      const error = {
        code: 2000,
        message: '이미 사용 중인 있는 이메일입니다.',
      };
      throw new BadRequestException(error);
    }

    const hashPassword = await this.bcryptService.makeHash(
      createUserDto.password,
    );

    const { password, ...user } = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });

    return {
      message: 'ok',
      user,
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
}
