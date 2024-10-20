// transaction.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { TransactionDto } from './dto/transactions.dto';
import { Transaction } from './transaction';
import { Transactions as TransactionEntity } from './entities/transaction.entity';
import { ClientProxy } from '@nestjs/microservices';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    @Inject('PAYABLE_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(transactionDto: TransactionDto): Promise<Transaction | boolean> {
    const transactionBuilded = this.builTransaction(transactionDto);

    try {
      const data = await this.entityManager.transaction(
        async (entityManager) => {
          const savedTransaction = await entityManager.save(
            TransactionEntity,
            transactionBuilded,
          );

          return savedTransaction;
        },
      );

      const result = await firstValueFrom(
        this.client.send('create_payable', {
          customerId: data.customerId,
          transactionId: data.id,
          amount: data.amount,
        }),
      );

      if (result) {
        return data;
      }

      return false;
    } catch (e) {
      this.logger.error(e);
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
      this.logger.error(e);
    }
  }
}
