// balance.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { BalanceDto } from './dto/balance.dto';
import { Balance as BalanceEntity } from './entities/balance.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(
    @InjectRepository(BalanceEntity)
    private balanceRepository: Repository<BalanceEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(data: BalanceDto) {
    try {
      const updatedBalance = await this.entityManager.transaction(
        async (transactionManager) => {
          let balance = await transactionManager.findOne(BalanceEntity, {
            where: { customerId: data.customerId },
          });

          if (balance) {
            if (data.status === 'pending') {
              balance.available = +balance.available + +data.amount;
            } else if (data.status === 'paid') {
              balance.paid = +balance.paid + +data.amount;
            }
          } else {
            balance = this.buildBalance(data);
          }

          return transactionManager.save(BalanceEntity, balance);
        },
      );

      return updatedBalance;
    } catch (e) {
      this.logger.error(
        `Error updating/inserting balance: ${e.message}`,
        e.stack,
      );
    }
  }

  private buildBalance(data: BalanceDto) {
    const balance: BalanceEntity = this.balanceRepository.create({
      customerId: data.customerId,
      available: data.status === 'pending' ? data.amount : 0,
      paid: data.status === 'paid' ? data.amount : 0,
    });

    return balance;
  }

  async findBalance(customerId: number): Promise<BalanceEntity | null> {
    try {
      const balance = await this.balanceRepository.findOne({
        where: {
          customerId,
        },
      });

      return balance;
    } catch (e) {
      this.logger.error(
        `Error finding balance for customer ${customerId}: ${e.message}`,
        e.stack,
      );
      return null;
    }
  }
}
