import { Customers } from 'src/customers/entitites/customers.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Payable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: number;

  @Column()
  customerId: number;

  @OneToOne(() => Transaction)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transaction;

  @OneToOne(() => Customers)
  @JoinColumn({ name: 'customerId' })
  customer: Customers;

  @Column()
  status: string;

  @Column()
  amount: number;

  @CreateDateColumn()
  paymentDate: Date;
}
