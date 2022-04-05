import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";

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

  @Column({})
  movieId: number;

  @ManyToOne(_ => User, user => user.id)
  user: User;

  @CreateDateColumn({})
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({default: true})
  isValid: boolean

}
