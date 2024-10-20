import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BalanceService } from './balance.service';
import { BalanceDto } from './dto/balance.dto';

@Controller()
export class BalanceController {
  private readonly logger = new Logger(BalanceService.name);

  constructor(private readonly balanceService: BalanceService) {}

  @MessagePattern('create_balance')
  async handleCreateBalance(@Payload() data: BalanceDto) {
    this.logger.log(`Received balance data: ${data}`);

    try {
      const result = await this.balanceService.create(data);
      if (result) {
        return result;
      }

      throw new HttpException('Fail to create balance', HttpStatus.BAD_REQUEST);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @MessagePattern('get_customer_balance')
  async handleGetCustomerBalance(@Payload() customerId: number) {
    this.logger.log(`Getting balance data`);

    try {
      const result = await this.balanceService.findBalance(customerId);
      if (result) {
        return result;
      }

      throw new HttpException(
        'Customer Balance not found',
        HttpStatus.NOT_FOUND,
      );
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }
}
