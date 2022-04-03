import {extendApi} from '@anatine/zod-openapi';
import {z} from 'zod';
import {createZodDto} from "@anatine/zod-nestjs";

const UserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(3).max(10),
  phoneNumber: z.string(),
  nickName: z.string()
})
const UserZ = extendApi(
  UserSchema
  , {
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
  }),
  user: UserSchema.omit({password: true}).extend({ id: z.number()})
});

export class CreateUserResponseDto extends createZodDto(CreateUserResponseZ) {
}