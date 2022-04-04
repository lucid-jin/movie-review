import {BadRequestException, Body, Controller, Get, HttpCode, Post, Query, UsePipes} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiCreatedResponse} from '@nestjs/swagger';
import {CreateUserDto, CreateUserResponseDto} from "./schema/user.schema";
import {ZodValidationPipe} from "@anatine/zod-nestjs";
import {BcryptService} from "../util/bcrypt/bcrypt.service";
import {z, ZodError} from "zod";

@Controller('user')
@UsePipes(ZodValidationPipe)       
export class UserController {
  constructor(private readonly userService: UserService, private readonly bcryptService: BcryptService) {
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateUserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto
  ): Promise<CreateUserResponseDto> {
    const alreadyUser = await this.userService.findOne({email: createUserDto.email, isValid: true})

    if (alreadyUser) {
      const error: CreateUserResponseDto = {
        Response: {
          code: 2000,
          message: '이미 사용 중인 있는 이메일입니다.'
        }
      };
      throw new BadRequestException(error)
    }

    const hashPassword = await this.bcryptService.makeHash(createUserDto.password)

    const {password, ...user} = await this.userService.create({...createUserDto, password: hashPassword});

    return {
      Response: {
        code: 1000,
        message: 'ok'
      },
      user
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll({});
  }

  @Get('identities')
  async identify(@Query() {value, type}: { value: string, type: 'email' | 'nickName' }) {

    const typeEnum = z.enum(['email', 'nickName']);
    try {
      typeEnum.parse(type)
      if (type === 'email') {
        z.string().email().parse(value)
      }
      z.string().min(3).max(15).parse(value)

    } catch (e) {
      const error: ZodError = e;
      throw new BadRequestException({
          Response: {
            message: error.issues.map(is => is.message).join(',')
          }
        }
      )
    }

      const user = await this.userService.findOne({
        [type]: [value]
      });

      const isExistUser = !!user;

      return {
        Response: {
          code: 1000,
          message: !isExistUser ? '존재하지않는 이메일 입니다' : '이미 있는 이메일 입니다'
        },
        isExist: isExistUser
      }
    }
}
