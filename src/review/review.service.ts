import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {CreateReviewDto} from './dto/create-review.dto';
import {UpdateReviewDto} from './dto/update-review.dto';
import {ReviewRepository} from "./dto/review.repository";
import {User} from "../user/entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Review} from "./entities/review.entity";

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: ReviewRepository
  ) {
  }

  removePassword(value) {
    if (value && value.user) {
      value.user = User.removePassword(value.user);
    }
    return value;
  }

  create(createReviewDto: CreateReviewDto, user: User) {
    return this.reviewRepository.save({
      ...createReviewDto,
      user,
      likes: [],
    }, {}).then(this.removePassword)
  }

  findAll({movieId}: { movieId?: number }) {
    return this.reviewRepository.find({
      where: {
        ...(movieId && {movieId})
      },
      skip: 0,
      take: 50
    }).then(value => this.removePassword(value));
  }

  findOne(id: number) {
    return this.reviewRepository.findOne({
      where: {
        no: id,
      }
    }).then(this.removePassword)
  }

  update(id: number, {contents, ratings}: UpdateReviewDto) {
    return this.reviewRepository.save({
      ratings,
      contents,
      no: id
    }, {})
  }

  remove(id: number) {
    return this.reviewRepository.save({
      isValid: false,
      no: id
    })
  }

  async checkValidation(id: number, user: User) {

    const review = await this.findOne(+id);
    if (!review) {
      new BadRequestException({message: '존재하지 않는 리뷰입니다.'})
    }
    if (+review.user.id === +user.id) {
      new UnauthorizedException({message: '작성자와 다른 아이디 입니다..'})
    }
  }
}
