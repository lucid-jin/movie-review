import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BcryptService } from '../util/bcrypt/bcrypt.service';
import { Review } from '../review/entities/review.entity';
import { ExternalModule } from '../external/external.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Review]), ExternalModule],
  providers: [UserService, BcryptService],
  controllers: [UserController],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
