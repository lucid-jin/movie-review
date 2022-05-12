import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../user/entities/user.entity';
import { CommentRepository } from './entities/comment.repository';
import { ReviewService } from '../review/review.service';
import { Review } from '../review/entities/review.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: CommentRepository,
    private readonly reviewService: ReviewService,
  ) {}

  removePassword(value) {
    if (value && value.user) {
      value.user = User.removePassword(value.user);
    }
    return value;
  }

  async create({ contents }: CreateCommentDto, review: Review, user: User) {
    return await this.commentRepository.save({
      contents,
      review: {
        no: review.no,
      },
      user: {
        id: user.id,
      },
    });
  }

  async findAll(reviewNo: number) {
    const comments = await this.commentRepository.find({
      where: {
        review: {
          no: reviewNo,
        },
        isValid: true,
      },
      skip: 0,
      take: 50,
      relations: ['user'],
    });
    return comments.map(this.removePassword);
  }

  findOne(commentNo: number) {
    return this.commentRepository
      .findOne({
        where: {
          no: commentNo,
          isValid: true,
        },
        relations: ['user'],
      })
      .then(this.reviewService.removePassword);
  }

  async update(no: number, { contents }: UpdateCommentDto, comment) {
    return this.commentRepository.save({
      ...comment,
      contents,
    });
  }

  async remove(id: number, comment: Comment) {
    return await this.commentRepository.save({
      ...comment,
      isValid: false,
    });
  }

  async checkValidation(id: number, review: User) {
    const comment = await this.findOne(+id);
    if (!comment) {
      throw new NotFoundException({
        message: '유효하지 않는 댓글 아이디입니다',
      });
    }

    if (+comment.user.id !== +review.id) {
      throw new UnauthorizedException({
        message: '작성자와 다른 아이디 입니다..',
      });
    }
    return comment;
  }
}
