import { Customers } from 'src/customers/entitites/customers.entity';
import { Transactions } from 'src/transactions/entities/transaction.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Payable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: number;

  @Column()
  customerId: number;

  @OneToOne(() => Transactions)
  @JoinColumn({ name: 'transactionId' })
  transaction: Transactions;

  @ManyToOne(() => Customers, (customer) => customer.payable)
  @JoinColumn({ name: 'customerId' })
  customer: Customers;

  @Column()
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  paymentDate: Date;
}
