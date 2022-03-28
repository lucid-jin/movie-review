import {extendApi} from '@anatine/zod-openapi';
import {z} from 'zod';
import {User} from "../user.type";
import {createZodDto} from "@anatine/zod-nestjs";

export const UserZ = extendApi(
  z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(3).max(10),
    phoneNumber: z.string(),
    nickName: z.string()
  }), {
    title: 'User',
    description: 'A User'
  }
)

export class CreateUserDto extends createZodDto(UserZ) {
}

const CreateUserResponseZ = z.object({
  Response: z.object({
    code: z.number(),
    message: z.string(),
  })
});

export class CreateUserResponseDto extends createZodDto(CreateUserResponseZ) {
}