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
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { FindAllParams } from './dto/FindAllParams';
import { ReviewService } from '../review/review.service';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly commentService: CommentService,
  ) {}

  @UseGuards(AuthGuard())
  @Post()
  async create(
    @Body(new ValidationPipe()) createCommentDto: CreateCommentDto,
    @Req() req,
  ) {
    const review = await this.reviewService.findReviewOrNotFondError(
      createCommentDto.reviewNo,
    );

    return {
      message: 'ok',

      comment: await this.commentService.create(
        createCommentDto,
        review,
        req.user,
      ),
    };
  }

  @Get()
  async findAll(@Query() param: FindAllParams) {
    await this.reviewService.findReviewOrNotFondError(param.reviewNo);

    const comments = await this.commentService.findAll(+param.reviewNo);
    return {
      message: 'ok',
      comments: comments,
    };
  }

  @Get(':no')
  async findOne(@Param() param) {
    const comment = await this.commentService.findOne(+param.no);

    if (!comment)
      throw new NotFoundException({ message: '존재하지 않는 댓글 입니다' });

    return comment;
  }

  @UseGuards(AuthGuard())
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Req() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.commentService.checkValidation(
      Number(id),
      req.user,
    );
    return {
      message: 'ok',
      comment: await this.commentService.update(+id, updateCommentDto, comment),
    };
  }

  @UseGuards(AuthGuard())
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req) {
    const comment = await this.commentService.checkValidation(
      Number(id),
      req.user,
    );
    await this.commentService.remove(+id, comment);

    return {
      message: 'ok',
    };
  }
}
