import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Email: string

  @Column()
  password: string

  @Column()
  name: string

  @Column()
  nickName: string

  @Column()
  phoneNumber: string

}
