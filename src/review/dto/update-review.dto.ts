import {CreateReviewDto} from './create-review.dto';
import {OmitType} from "@nestjs/swagger";

export class UpdateReviewDto extends OmitType(CreateReviewDto, ['targetId', 'targetType'] as const) {
}