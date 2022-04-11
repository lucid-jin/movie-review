import {
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
  UseGuards
} from '@nestjs/common';
import {ReviewService} from './review.service';
import {CreateReviewDto} from './dto/create-review.dto';
import {UpdateReviewDto} from './dto/update-review.dto';
import {AuthGuard} from "@nestjs/passport";

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {
  }

  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Request() req
  ) {
    const review = await this.reviewService.create(createReviewDto, req.user)

    return {
      response: {
        message: 'ok',
        code: 1001
      },
      review
    }
  }

  @Get()
  async findAll(@Query() {movieId}: { movieId?: number }) {
    return {
      response: {
        message: 'ok'
      },
      reviews: await this.reviewService.findAll({
        movieId
      })
    } ;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.reviewService.findOne(+id)
    if (!review) throw new NotFoundException({
      response: {
        message: '존재하지 않는 리뷰 입니다.'
      }
    })

    return {
      response: {
        message: 'ok'
      },
      review
    };
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  async update(
    @Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto,
    @Request() req
  ) {
    const review = await this.reviewService.checkValidation(+id, req.user);

    return {
      response: {
        message: 'ok',
        code: 1000
      },
      review: await this.reviewService.update(+id, updateReviewDto, review)
    }
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const review = await this.reviewService.checkValidation(+id, req.user);
    await this.reviewService.remove(+id, review);

    return {
      response: {
        message: 'ok',
        code: 1000
      }
    }
  }
}
