import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transactions.service';
import { TransactionDto } from './dto/transactions.dto';

@Controller()
export class TransactionController {
  private readonly logger = new Logger(TransactionService.name);

  constructor(private readonly transactionService: TransactionService) {}

  @EventPattern('create_transaction')
  async handleCreateTransaction(@Payload() data: TransactionDto) {
    this.logger.log(`Received transaction data: ${JSON.stringify(data)}...`);
    return this.transactionService.create(data);
  }

  @EventPattern('get_all_transaction')
  async handleGetAllTransactions() {
    this.logger.log(`Getting Transactions...`);
    try {
      const response = this.transactionService.findAll();
      return response;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
