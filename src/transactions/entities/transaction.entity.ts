import { Customers } from 'src/customers/entitites/customers.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @ManyToOne(() => Customers, (customer) => customer.transactions)
  @JoinColumn({ name: 'customerId' })
  customer: Customers;

  @Column()
  description: string;

  @Column()
  cardholderName: string;

  @Column()
  cardLastFour: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;
}
