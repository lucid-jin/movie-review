import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {CreateUserDto} from "./schema/user.schema";
import {Repository} from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
  }

  async create(createUserDto: CreateUserDto) {

    try {
      return await this.userRepository.save(createUserDto)
    } catch (e) {
      throw new Error(e)
    }
  }

  findAll({email, isValid = true}: { email?: string, isValid?: boolean}) {
    console.log(email)

    return this.userRepository.find({
      where: {
        ...(email && {email}),
        isValid
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
