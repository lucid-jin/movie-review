import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  InternalServerErrorException, UsePipes, HttpException, BadRequestException
} from '@nestjs/common';
import {UserService} from './user.service';
import {ApiCreatedResponse} from '@nestjs/swagger';
import {CreateUserDto, CreateUserResponseDto} from "./schema/user.schema";
import {ZodValidationPipe} from "@anatine/zod-nestjs";

@Controller('user')
@UsePipes(ZodValidationPipe)
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Post()
  @HttpCode(201)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: CreateUserResponseDto,
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const alreadyUser = this.userService.findAll({email: createUserDto.email, isValid: true})

    if (alreadyUser) {
      const error: CreateUserResponseDto = {
        Response: {
          code: 2000,
          message: '이미 사용 중인 있는 이메일입니다.'
        }
      };
      throw new BadRequestException(error)
    }

    const {password, ...user} = await this.userService.create(createUserDto);
    
    return {
      Response: {
        code: 1000,
        message: 'ok'
      },
      ...user
    }

  }

  @Get()
  findAll() {
    return this.userService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
