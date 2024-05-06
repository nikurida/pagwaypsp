// transaction.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { TransactionDto } from './dto/transactions.dto';
import { TransactionRepository } from './repositories/transaction.repository';
import { Transaction } from './transaction';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TransactionService implements OnModuleInit {
  constructor(
    private transactionRepository: TransactionRepository,
    @Inject('PAYABLE_SERVICE') private readonly client: ClientProxy,
  ) {}

  onModuleInit() {
    this.client.connect();
  }

  async create(transactionDto: TransactionDto): Promise<Transaction> {
    const transactionBuilded = this.builTransaction(transactionDto);

    let transaction: Transaction;
    try {
      await this.transactionRepository.dataSource.transaction(
        async (entityManager) => {
          transaction = await entityManager.save(transactionBuilded);

          this.client.send(
            { role: 'payable', cmd: 'create' },
            {
              customerId: transaction.customerId,
              transactionId: transaction.id,
              amount: transaction.amount,
            },
          );
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
  }
}
