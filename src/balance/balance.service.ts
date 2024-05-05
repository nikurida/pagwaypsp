// balance.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Balance } from './balance';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { BalanceDto } from './dto/balance.dto';
import { BalanceRepository } from './repositories/balance.repository';

@Injectable()
export class BalanceService implements OnModuleInit {
  constructor(
    private balanceRepository: BalanceRepository,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  onModuleInit() {
    this.client.connect();
  }

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
        const balance = await entityManager.save(balanceBuilded);

        this.client.emit('balance_created_or_updated', balance);
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
