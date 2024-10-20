import { Customers } from 'src/customers/entitites/customers.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @OneToOne(() => Customers)
  @JoinColumn({ name: 'customerId' })
  customer: Customers;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  paid: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  available: number;
}
