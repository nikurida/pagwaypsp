import { Controller, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BalanceService } from './balance.service';
import { BalanceDto } from './dto/balance.dto';

@Controller()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @MessagePattern({ role: 'balance', cmd: 'create' })
  async createBalance(@Payload() data: BalanceDto) {
    console.log(`Received balance data: ${data}`);

    return this.balanceService.create(data);
  }

  @MessagePattern({ role: 'transaction', cmd: 'get' })
  async getCustomerBalance(@Param('customerId') customerId: number) {
    console.log(`Getting balance data`);
    return this.balanceService.findBalance(customerId);
  }
}
