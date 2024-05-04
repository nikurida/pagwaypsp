import { Customers } from 'src/customers/entitites/customers.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @OneToOne(() => Customers)
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

  @Column()
  amount: number;
}
