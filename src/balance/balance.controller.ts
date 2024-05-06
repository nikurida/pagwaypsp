import { BadRequestException, Controller, Param } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BalanceService } from './balance.service';
import { BalanceDto } from './dto/balance.dto';

@Controller()
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @MessagePattern({ role: 'balance', cmd: 'create' })
  async createBalance(@Payload() data: BalanceDto) {
    console.log(`Received balance data: ${data}`);

    try {
      const response = this.balanceService.create(data);
      return response;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @MessagePattern({ role: 'transaction', cmd: 'get' })
  async getCustomerBalance(@Param('customerId') customerId: number) {
    console.log(`Getting balance data`);

    try {
      const response = this.balanceService.findBalance(customerId);
      return response;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
