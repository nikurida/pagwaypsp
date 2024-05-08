import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transactions.service';
import { TransactionDto } from './dto/transactions.dto';

@Controller()
export class TransactionController {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('create_transaction')
  async handleCreateTransaction(@Payload() data: TransactionDto) {
    this.logger.log(`Received transaction data: ${JSON.stringify(data)}...`);
    try {
      const result = await this.transactionService.create(data);
      if (result) {
        return result;
      }

      throw new HttpException(
        'Fail to create transactions',
        HttpStatus.BAD_REQUEST,
      );
    } catch (error) {
      this.logger.error(`Error creating transaction: ${error}`);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @MessagePattern('get_all_transaction')
  async handleGetAllTransactions() {
    this.logger.log(`Getting Transactions...`);
    try {
      const result = await this.transactionService.findAll();

      if (result) {
        return result;
      }

      throw new HttpException(
        'Fail to get transactions',
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }
}
