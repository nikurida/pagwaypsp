import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Payable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: number;

  @Column()
  status: string;

  @Column()
  amount: number;

  @CreateDateColumn()
  paymentDate: Date;
}
