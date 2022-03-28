import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string

  @Column()
  password: string

  @Column()
  name: string

  @Column()
  nickName: string

  @Column()
  phoneNumber: string

  @Column({ default: true})
  isValid: boolean

}
