import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommentRepository } from './entities/comment.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Comment } from './entities/comment.entity';
import { ReviewModule } from '../review/review.module';

@Module({
  controllers: [CommentController],
  imports: [
    TypeOrmModule.forFeature([Comment]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    ReviewModule,
  ],
  providers: [CommentService, CommentRepository],
  exports: [TypeOrmModule],
})
export class CommentModule {}
