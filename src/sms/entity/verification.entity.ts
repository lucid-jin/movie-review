import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('verification')
export class VerificationEntity {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({
    type: 'int',
  })
  number: number;

  @Column({
    type: 'varchar',
    name: 'phone_number',
  })
  phoneNumber: string;

  @Column({
    type: 'bool',
    default: true,
  })
  isValid: boolean;

  @Column({
    width: 30,
    nullable: true,
  })
  token: string;

  @CreateDateColumn({})
  createdAt: Date;
}
