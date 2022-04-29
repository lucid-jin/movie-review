import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { User } from '../user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { Comment } from '../comment/entities/comment.entity';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User, Comment]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    MovieModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
