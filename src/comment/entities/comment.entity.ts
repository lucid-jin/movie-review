import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { User } from '../../user/entities/user.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'text',
  })
  contents: string;

  @ManyToOne(() => Review, (review) => review.no)
  review: Review;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isValid: boolean;
}
