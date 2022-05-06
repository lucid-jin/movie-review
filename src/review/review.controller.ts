import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
    let targetTitle = '';
    try {
      targetTitle = await this.movieService.find(
        createReviewDto.targetType,
        createReviewDto.targetId,
      );
    } catch (e) {
      if (!targetTitle) {
        throw new NotFoundException({
          message: `${createReviewDto.targetType}: ${createReviewDto.targetId} 는 존재하지 않습니다`,
        });
      }
    }

    const review = await this.reviewService.create(
      { ...createReviewDto, targetTitle },
      req.user,
    );

    return {
      message: 'ok',
      review: {
        title: targetTitle,
        ...review,
      },
    };
  }

  @Get()
  async findAll(
    @Query()
    { targetId, targetType }: { targetId: number; targetType: 'movie' | 'tv' },
  ) {
    const _reviews = await this.reviewService.findAll(targetId, targetType);
    const reviews = _reviews.map((d) => ({ title: d.targetTitle, ...d }));

    return {
      message: 'ok',

      reviews,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.reviewService.findReviewOrNotFondError(+id);

    return {
      message: 'ok',

      review: {
        title: data.targetTitle,
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

    const resData = await this.reviewService.update(
      +id,
      updateReviewDto,
      review,
    );

    return {
      message: 'ok',

      review: {
        title: resData.targetTitle,
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
      message: 'ok',
    };
  }

  @UseGuards(AuthGuard())
  @Put(':id/like')
  async like(@Param('id') reviewId: string, @Request() request) {
    const data = await this.reviewService.findReviewOrNotFondError(+reviewId);
    const userId = parseInt(request.user.id, 10);

    if (data.user.id === userId) {
      throw new ForbiddenException({
        message: '본인은 추천할수 없습니다',
      });
    }

    if (data.likes.find((d) => d === String(userId))) {
      throw new ForbiddenException({
        message: '이미 추천한 리뷰 입니다',
      });
    }

    data.likes.push(+userId);
    await this.reviewService.save(data);

    return {
      message: 'ok',
      totalLike: data.likes.length,
    };
  }

  @UseGuards(AuthGuard())
  @Put(':id/unlike')
  async unlike(@Param('id') id: string, @Request() request) {
    const data = await this.reviewService.findReviewOrNotFondError(+id);

    if (data.user.id === request.user.id) {
      throw new ForbiddenException({
        message: '본인은 추천할수 없습니다',
      });
    }

    data.likes = data.likes.filter((d) => d === id);
    await this.reviewService.save(data);
    return {
      message: 'ok',
      totalLike: data.likes.length,
    };
  }
}
