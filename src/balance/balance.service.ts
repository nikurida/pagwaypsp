// balance.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { Balance } from './balance';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BalanceDto } from './dto/balance.dto';
import { BalanceRepository } from './repositories/balance.repository';

@Injectable()
export class BalanceService {
  constructor(private balanceRepository: BalanceRepository) {}

  @MessagePattern('payable_created')
  async handleTransactionCreated(
    @Payload() data: BalanceDto,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Received payable data: ${data}`);
    this.create(data);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  private async create(data: BalanceDto) {
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
      this.balanceRepository.dataSource.transaction(async (entityManager) => {
        await entityManager.save(balanceBuilded);
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private buildBalance(data: BalanceDto) {
    try {
      const balance = this.balanceRepository.create(data);
      return balance;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  private async getBalanceOrNull(customerId: number) {
    return await this.balanceRepository.findOne({
      where: {
        customerId,
      },
      relations: {
        customer: true,
      },
    });
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
