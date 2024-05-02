// transaction.service.ts
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/transactions.dto';
import { TransactionRepository } from './repositories/transaction.repository';
import { Transaction } from './transaction';

@Injectable()
export class TransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const { cardNumber, ...rest } = createTransactionDto;
    const transaction = this.transactionRepository.create({
      ...rest,
      cardLastFour: cardNumber.slice(-4),
    });
    await this.transactionRepository.save(transaction);
    return {
      id: transaction.id,
      amount: transaction.amount,
      description: transaction.description,
      cardLastFour: transaction.cardLastFour,
      createdAt: transaction.createdAt,
    };
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find();
    return transactions.map((transaction) => {
      return {
        id: transaction.id,
        amount: transaction.amount,
        description: transaction.description,
        cardLastFour: transaction.cardLastFour,
        createdAt: transaction.createdAt,
      };
    });
  }
}
