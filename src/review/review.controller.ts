import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  ValidationPipe
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
    @Body(new ValidationPipe()) createReviewDto: CreateReviewDto,
    @Request() req
  ) {
    return await this.reviewService.create(createReviewDto, req.user)
  }

  @Get()
  findAll(@Query() {movieId}: { movieId?: number }) {
    return this.reviewService.findAll({
      movieId
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto,
    @Request() req
  ) {
    await this.reviewService.checkValidation(+id, req.user);
    return this.reviewService.update(+id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.reviewService.checkValidation(+id, req.user);
    return this.reviewService.remove(+id);
  }
}
