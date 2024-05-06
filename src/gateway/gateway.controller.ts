import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TransactionDto } from '../transactions/dto/transactions.dto';
import { BalanceDto } from '../balance/dto/balance.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersDto } from 'src/users/dto/users.dto';

@Controller('Gateway API')
export class GatewayController {
  constructor(
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
    @Inject('TRANSACTIONS_SERVICE') private transactionsClient: ClientProxy,
    @Inject('BALANCE_SERVICE') private balanceClient: ClientProxy,
  ) {}

  @Post('transaction')
  @ApiTags('Transactions')
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  @ApiBody({ type: TransactionDto })
  @UseGuards(AuthGuard('jwt'))
  async createTransaction(@Body() transactionDto: TransactionDto) {
    return this.transactionsClient.send(
      { role: 'transaction', cmd: 'create' },
      transactionDto,
    );
  }

  @Post('user')
  @ApiTags('Users')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBody({ type: UsersDto })
  @UseGuards(AuthGuard('jwt'))
  async createUser(@Body() userDto: UsersDto) {
    return this.usersClient.send({ role: 'user', cmd: 'create' }, userDto);
  }

  @Get('transactions')
  @ApiTags('Transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  @UseGuards(AuthGuard('jwt'))
  async getAllTransactions() {
    return this.transactionsClient.send(
      { role: 'transaction', cmd: 'get' },
      {},
    );
  }

  @Get('balance/:customerId')
  @ApiTags('Balance')
  @ApiOperation({ summary: 'Get customer balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  @ApiBody({ type: BalanceDto })
  @UseGuards(AuthGuard('jwt'))
  async getCustomerBalance(@Param('customerId') customerId: number) {
    return this.balanceClient.send({ role: 'balance', cmd: 'get' }, customerId);
  }
}
