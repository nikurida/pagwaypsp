import { Controller, Get, Param } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { Balance } from './balance';

@Controller('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':customerId')
  async getBalance(@Param('customerId') customerId: number): Promise<Balance> {
    return this.balanceService.findBalance(customerId);
  }
}
