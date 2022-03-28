import {EntityRepository, Repository} from 'typeorm';

import {User} from './user.entity';
import {CreateUserDto} from "../schema/user.schema";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(user: CreateUserDto){

    console.log(this, user)
    const res =  await this.save(user)
    console.log(res)
  }
}
