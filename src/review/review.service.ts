import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './review.repository';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';

class CreateReview extends CreateReviewDto {
  targetTitle: string;
}

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: ReviewRepository,
  ) {}

  removePassword(value) {
    if (value && value.user) {
      value.user = User.removePassword(value.user);
    }
    return value;
  }

  async create(createReviewDto: CreateReview, user: User) {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      user,
      likes: [],
    });
    this.removePassword(review);

    return this.reviewRepository.save(review);
  }

  async findAll(targetId: number, targetType: 'movie' | 'tv') {
    const reviews = await this.reviewRepository.find({
      where: {
        ...(targetId && { targetId }),
        ...(targetType && { targetType }),
        isValid: true,
      },
      skip: 0,
      take: 50,
      relations: ['user'],
    });

    return reviews.map(this.removePassword);
  }

  async findOrFail(id: number) {
    return await this.reviewRepository.findOneOrFail({
      where: {
        no: id,
        isValid: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.reviewRepository
      .findOne({
        where: {
          no: id,
          isValid: true,
        },
        relations: ['user'],
      })
      .then(this.removePassword);
  }

  async update(
    no: number,
    { contents, ratings }: UpdateReviewDto,
    review: Review,
  ) {
    review.contents = contents;
    review.ratings = ratings;

    return this.reviewRepository.save(review);
  }

  remove(id: number, review: Review) {
    review.isValid = false;
    return this.reviewRepository.save(review);
  }

  async checkValidation(id: number, user: User) {
    const review = await this.findOne(+id);
    if (!review) {
      throw new NotFoundException({
        message: '존재하지 않는 리뷰입니다.',
      });
    }

    if (+review.user?.id !== +user.id) {
      throw new ForbiddenException({
        message: '작성자와 다른 아이디 입니다..',
      });
    }
    return review;
  }

  async findReviewOrNotFondError(id: number) {
    const data = await this.findOne(+id);
    if (!data) {
      throw new NotFoundException({ message: '존재하지 않는 리뷰 입니다.' });
    }

    return data;
  }

  async save(review: Review) {
    return await this.reviewRepository.save(review);
  }
}
