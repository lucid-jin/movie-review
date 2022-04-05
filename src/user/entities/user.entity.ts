import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Review} from "../../review/entities/review.entity";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint'
  })
  id: number;

  @Column({
    width: 50
  })
  email: string

  @Column({
    width: 50
  })
  password: string

  @Column({
    width: 30
  })
  name: string

  @Column({
    width: 30
  })
  nickName: string

  @Column({
    width: 20
  })
  phoneNumber: string;

  @OneToMany(type => Review, review => review.no)
  review: Review;

  @CreateDateColumn({})
  createdAt: Date;

  @Column({default: true})
  isValid: boolean

  static removePassword(userObj: User) {
    return Object.fromEntries(
      Object.entries(userObj).filter(([key, val]) => key !== 'password')
    );
  }

}
