import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transactions.service';
import { TransactionDto } from './dto/transactions.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern({ role: 'transaction', cmd: 'create' })
  async createTransaction(@Payload() data: TransactionDto) {
    console.log(`Received transaction data: ${data}`);
    return this.transactionService.create(data);
  }

  @MessagePattern({ role: 'transaction', cmd: 'get' })
  async getAllTransactions() {
    console.log(`Getting transaction data`);
    return this.transactionService.findAll();
  }
}
