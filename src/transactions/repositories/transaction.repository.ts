import { DataSource, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(public dataSource: DataSource) {
    super(Transaction, dataSource.createEntityManager());
  }
}
