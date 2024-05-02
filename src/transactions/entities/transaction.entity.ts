import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

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
