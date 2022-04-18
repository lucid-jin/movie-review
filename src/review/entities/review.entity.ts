import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import {User} from "../../user/entities/user.entity";
import {Comment} from "../../comment/entities/comment.entity";

@Entity('review')
export class Review {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'text'
  })
  contents: string

  @Column({ type: "int"})
  ratings: number;

  @Column("simple-array", {
    default: [""]
  })
  likes: number[];

  
  @Column({
    enum: ['movie', 'tv']
  })
  targetType: 'movie' | 'tv'

  @Column({})
  targetId: number;

  @ManyToOne(_ => User, user => user.id)
  @JoinTable()
  user: User;

  @OneToMany(_ => Comment, comment => comment.no)
  comments: Comment[];

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({default: true})
  isValid: boolean

}
