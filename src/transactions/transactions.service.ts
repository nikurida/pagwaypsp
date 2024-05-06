// transaction.service.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transactions.dto';
import { TransactionRepository } from './repositories/transaction.repository';
import { Transaction } from './transaction';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    @Inject('TRANSACTIONS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(transactionDto: TransactionDto): Promise<Transaction> {
    const transactionBuilded = this.builTransaction(transactionDto);

    try {
      const transaction =
        await this.transactionRepository.dataSource.transaction(
          async (entityManager) => {
            const savedTransaction =
              await entityManager.save(transactionBuilded);

            return savedTransaction;
          },
        );

      this.client.send(
        { role: 'payable', cmd: 'create' },
        {
          customerId: transaction.customerId,
          transactionId: transaction.id,
          amount: transaction.amount,
        },
      );

      return transaction;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private builTransaction(transaction: TransactionDto) {
    const { cardNumber, ...rest } = transaction;

    return this.transactionRepository.create({
      ...rest,
      cardLastFour: cardNumber.slice(-4),
    });
  }

  async findAll(): Promise<Transaction[]> {
    try {
      const transactions = await this.transactionRepository.find();
      return transactions.map((transaction) => {
        return {
          id: transaction.id,
          amount: transaction.amount,
          customerId: transaction.customerId,
          description: transaction.description,
          cardLastFour: transaction.cardLastFour,
          createdAt: transaction.createdAt,
        };
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
