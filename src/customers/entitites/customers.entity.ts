import { Payable } from 'src/payable/entities/payable.entity';
import { Transactions } from 'src/transactions/entities/transaction.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'bigint' })
  cpf: number;

  @Column()
  status: string;

  @OneToMany(() => Transactions, (transaction) => transaction.customer)
  transactions: Transactions[];

  @OneToMany(() => Payable, (payable) => payable.customer)
  payable: Payable[];
}
