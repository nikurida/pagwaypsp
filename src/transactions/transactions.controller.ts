import { BadRequestException, Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transactions.service';
import { TransactionDto } from './dto/transactions.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern({ role: 'transaction', cmd: 'create' })
  async createTransaction(@Payload() data: TransactionDto) {
    console.log(`Received transaction data: ${data}`);
    try {
      const response = await this.transactionService.create(data);
      return response;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @MessagePattern({ role: 'transaction', cmd: 'get' })
  async getAllTransactions() {
    console.log(`Getting transaction data`);
    try {
      const response = this.transactionService.findAll();
      return response;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
