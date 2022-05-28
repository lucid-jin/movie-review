import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './schema/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.userRepository.save(createUserDto);
    } catch (e) {
      throw new Error(e);
    }
  }

  findAll({ email, isValid = true }: { email?: string; isValid?: boolean }) {
    return this.userRepository.find({
      where: {
        ...(email && { email }),
        isValid,
      },
    });
  }

  findOne({
    email,
    nickName,
    name,
    phoneNumber,
    isValid = true,
  }: {
    name?: string;
    nickName?: string;
    email?: string;
    phoneNumber?: string;
    isValid?: boolean;
  }) {
    if (!email && !nickName && !name) {
      return undefined;
    }

    return this.userRepository.findOne({
      where: {
        ...(email && { email }),
        ...(name && { name }),
        ...(nickName && { nickName }),
        ...(phoneNumber && { phoneNumber }),
        isValid,
      },
    });
  }

  update(id: number, user: User) {
    return this.userRepository.save({
      ...user,
    });
  }
}
