import { Controller, Logger, Param } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BalanceService } from './balance.service';
import { BalanceDto } from './dto/balance.dto';

@Controller()
export class BalanceController {
  private readonly logger = new Logger(BalanceService.name);

  constructor(private readonly balanceService: BalanceService) {}

  @EventPattern('create_balance')
  async createBalance(@Payload() data: BalanceDto) {
    this.logger.log(`Received balance data: ${data}`);

    try {
      const response = this.balanceService.create(data);
      return response;
    } catch (e) {
      this.logger.error(e);
    }
  }

  @EventPattern('get_customer_balance')
  async getCustomerBalance(@Param('customerId') customerId: number) {
    this.logger.log(`Getting balance data`);

    try {
      const response = this.balanceService.findBalance(customerId);
      return response;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
