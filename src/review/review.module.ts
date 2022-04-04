import {Module} from '@nestjs/common';
import {ReviewService} from './review.service';
import {ReviewController} from './review.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Review} from "./entities/review.entity";
import {User} from "../user/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Review, User])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {
}
