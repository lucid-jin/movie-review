import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
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

  @Column({default: true})
  isValid: boolean

}
