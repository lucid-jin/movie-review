import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from '@nestjs/passport';

import { MovieService } from '../movie/movie.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly movieService: MovieService,
  ) {}

  @UseGuards(AuthGuard())
  @Post()
  async create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    const title = await this.movieService.find(
      createReviewDto.targetType,
      createReviewDto.targetId,
    );
    const review = await this.reviewService.create(createReviewDto, req.user);

    return {
      response: {
        message: 'ok',
        code: 1001,
      },
      review: {
        title,
        ...review,
      },
    };
  }

  @Get()
  async findAll(
    @Query()
    { targetId, targetType }: { targetId: number; targetType: 'movie' | 'tv' },
  ) {
    const title = await this.movieService.find(targetType, targetId);

    const _reviews = await this.reviewService.findAll(targetId, targetType);
    const reviews = _reviews.map((d) => ({ title, ...d }));

    return {
      response: {
        message: 'ok',
      },
      reviews,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.reviewService.findOne(+id);
    if (!data)
      throw new NotFoundException({
        response: {
          message: '존재하지 않는 리뷰 입니다.',
        },
      });

    const title = await this.movieService.find(data.targetType, data.targetId);

    return {
      response: {
        message: 'ok',
      },
      review: {
        title,
        ...data,
      },
    };
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    const review = await this.reviewService.checkValidation(+id, req.user);

    const title = await this.movieService.find(
      review.targetType,
      review.targetId,
    );
    const resData = await this.reviewService.update(
      +id,
      updateReviewDto,
      review,
    );

    return {
      response: {
        message: 'ok',
        code: 1000,
      },
      review: {
        title,
        ...resData,
      },
    };
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const review = await this.reviewService.checkValidation(+id, req.user);
    await this.reviewService.remove(+id, review);

    return {
      response: {
        message: 'ok',
        code: 1000,
      },
    };
  }
}
