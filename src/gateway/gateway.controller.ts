import { Controller, Post, Get, Body, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionDto } from '../transactions/dto/transactions.dto'; // Assumindo que o DTO é compartilhado
import { CreatePayableDto } from '../payable/dto/payable.dto';

@Controller()
export class GatewayController {
  constructor(
    @Inject('TRANSACTIONS_SERVICE') private transactionsClient: ClientProxy,
    @Inject('PAYABLE_SERVICE') private payableClient: ClientProxy,
    @Inject('BALANCE_SERVICE') private balanceClient: ClientProxy,
  ) {}

  @Post('transactions')
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsClient.emit<{ status: string }>(
      'create_transaction',
      createTransactionDto,
    );
  }

  @Get('transactions')
  async getAllTransactions() {
    return this.transactionsClient.send<{ status: string }>(
      'get_transactions',
      {},
    );
  }

  @Post('payables')
  async createPayable(@Body() createPayableDto: CreatePayableDto) {
    return this.payableClient.emit<{ status: string }>(
      'create_payable',
      createPayableDto,
    );
  }

  @Get('balance/:customerId')
  async getCustomerBalance(@Param('customerId') customerId: number) {
    return this.balanceClient.send<{ balance: number }>(
      'get_customer_balance',
      { customerId },
    );
  }
}
