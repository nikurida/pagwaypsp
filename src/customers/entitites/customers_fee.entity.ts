import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customers } from './customers.entity';

@Entity()
export class CustomersFee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @OneToOne(() => Customers)
  @JoinColumn({ name: 'customerId' })
  customer: Customers;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  fee: number;
}
