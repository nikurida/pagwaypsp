import { Controller, Logger, Param } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { BalanceService } from './balance.service';
import { BalanceDto } from './dto/balance.dto';

@Controller()
export class BalanceController {
  private readonly logger = new Logger(BalanceService.name);

  constructor(private readonly balanceService: BalanceService) {}

  @MessagePattern('create_balance')
  async createBalance(@Payload() data: BalanceDto) {
    this.logger.log(`Received balance data: ${data}`);

    try {
      const result = this.balanceService.create(data);
      return {
        status: 'success',
        message: 'Balance created',
        data: result,
      };
    } catch (e) {
      this.logger.error(e);
      return { status: 'error', message: 'Fail to create balance' };
    }
  }

  @EventPattern('get_customer_balance')
  async getCustomerBalance(@Param('customerId') customerId: number) {
    this.logger.log(`Getting balance data`);

    try {
      const result = this.balanceService.findBalance(customerId);
      if (result) {
        return {
          status: 'success',
          message: '',
          data: result,
        };
      }

      return {
        status: 404,
        message: 'Can not found balance for this Customer',
      };
    } catch (e) {
      this.logger.error(e);
      return { status: 'error', message: 'Fail to get balance' };
    }
  }
}
