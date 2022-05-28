import { extendApi } from '@anatine/zod-openapi';
import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';

const globalResponse = z.object({
  message: z.string(),
});

const UserSchema = z.object({
  name: z.string({
    description: '유저 이름',
  }),
  email: z
    .string({
      description: '이메일',
    })
    .email(),
  password: z
    .string({
      description: '비밀번호',
    })
    .min(3)
    .max(10),
  phoneNumber: z.string(),
  nickName: z.string(),
});
const UserZ = extendApi(UserSchema, {
  title: 'User',
  description: 'A User',
});

export class CreateUserDto extends createZodDto(UserZ) {}

const CreateUserResponseZ = globalResponse.merge(
  z.object({
    user: UserSchema.omit({ password: true }).extend({ id: z.number() }),
  }),
);

export class GlobalAPI extends createZodDto(globalResponse) {}

export class CreateUserResponseDto extends createZodDto(CreateUserResponseZ) {}

export class CreateIdentifyDto extends createZodDto(
  z.object({
    type: z.enum(['email', 'nickName']),
    value: z.string(),
  }),
) {}

export class FindEmailDto extends createZodDto(
  z.object({
    name: z.string(),
    phoneNumber: z.string(),
  }),
) {}

export class IdentifyResponseDto extends createZodDto(
  globalResponse.merge(
    z.object({
      isExist: z.boolean(),
    }),
  ),
) {}

export class UpdatePasswordDto extends createZodDto(
  z.object({
    password: z.string().min(3).max(10),
    email: z.string().email(),
    token: z.string(),
  }),
) {}
