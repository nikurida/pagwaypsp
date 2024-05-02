import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  private transactions = [];

  create(createTransactionDto: CreateTransactionDto) {
    this.transactions.push(createTransactionDto);
    return createTransactionDto;
  }

  findAll() {
    return this.transactions;
  }
}
