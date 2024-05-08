import { BadRequestException, Controller, Logger } from '@nestjs/common';
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
        return {
          status: 'success',
          message: 'Transaction created',
          data: result,
        };
      }
      throw new BadRequestException();
    } catch (error) {
      this.logger.error(`Error creating transaction: ${error}`);
      return { status: 'error', message: 'Failed to create transaction' };
    }
  }

  @MessagePattern('get_all_transaction')
  async handleGetAllTransactions() {
    this.logger.log(`Getting Transactions...`);
    try {
      const result = await this.transactionService.findAll();

      return {
        status: 'success',
        message: '',
        data: result,
      };
    } catch (e) {
      this.logger.error(e);
      return { status: 'error', message: 'Failed to get transaction' };
    }
  }
}
