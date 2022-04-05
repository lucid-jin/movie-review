import {Module} from '@nestjs/common';
import {ReviewService} from './review.service';
import {ReviewController} from './review.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Review} from "./entities/review.entity";
import {User} from "../user/entities/user.entity";
import {PassportModule} from "@nestjs/passport";

@Module({
  imports: [TypeOrmModule.forFeature([Review, User]),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {
}
