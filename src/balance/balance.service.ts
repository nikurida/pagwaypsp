// balance.service.ts
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Balance } from './balance';
import { BalanceDto } from './dto/balance.dto';
import { BalanceRepository } from './repositories/balance.repository';

@Injectable()
export class BalanceService {
  private readonly logger = new Logger(BalanceService.name);

  constructor(private balanceRepository: BalanceRepository) {}

  async create(data: BalanceDto) {
    let balanceBuilded = await this.getBalanceOrNull(data.customerId);

    if (balanceBuilded) {
      if (data.status === 'pending') {
        balanceBuilded.available = balanceBuilded.available + data.amount;
      }

      if (data.status === 'paid') {
        balanceBuilded.paid = balanceBuilded.paid + data.amount;
      }
    } else {
      balanceBuilded = this.buildBalance(data);
    }

    try {
      const balance = this.balanceRepository.dataSource.transaction(
        async (entityManager) => {
          const savedBalance = await entityManager.save(balanceBuilded);

          return savedBalance;
        },
      );

      return balance;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private buildBalance(data: BalanceDto) {
    try {
      const balance = this.balanceRepository.create(data);
      return balance;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async getBalanceOrNull(customerId: number) {
    try {
      return await this.balanceRepository.findOne({
        where: {
          customerId,
        },
        relations: {
          customer: true,
        },
      });
    } catch (e) {
      this.logger.error(e);
    }
  }

  async findBalance(customerId: number): Promise<Balance> {
    try {
      return this.balanceRepository.findOne({
        where: {
          customerId,
        },
        relations: {
          customer: true,
        },
      });
    } catch (e) {
      throw new BadRequestException('Balance not found');
    }
  }
}
