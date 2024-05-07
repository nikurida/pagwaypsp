import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  BadRequestException,
  //UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TransactionDto } from '../transactions/dto/transactions.dto';
import { BalanceDto } from '../balance/dto/balance.dto';
//import { AuthGuard } from '@nestjs/passport';
import { UsersDto } from 'src/users/dto/users.dto';
import { Logger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
    @Inject('TRANSACTIONS_SERVICE') private transactionsClient: ClientProxy,
    @Inject('BALANCE_SERVICE') private balanceClient: ClientProxy,
    private readonly logger: Logger,
  ) {}

  @Post('transaction')
  @ApiTags('Transactions')
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  @ApiBody({ type: TransactionDto })
  async createTransaction(
    @Body() transactionDto: TransactionDto,
  ): Promise<any> {
    this.logger.log(`Creating transaction: ${JSON.stringify(transactionDto)}`);

    try {
      const response = await firstValueFrom(
        this.transactionsClient.emit<{ status: string; message: string }>(
          'create_transaction',
          transactionDto,
        ),
      );

      if (response && response.status === 'success') {
        return { status: 201, message: response.message };
      } else {
        throw new BadRequestException(response.message);
      }
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('Failed to create transaction');
    }
  }

  @Post('user')
  @ApiTags('Users')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBody({ type: UsersDto })
  //@UseGuards(AuthGuard('jwt'))
  createUser(@Body() userDto: UsersDto) {
    return this.usersClient.send({ role: 'user', cmd: 'create' }, userDto);
  }

  @Get('transactions')
  @ApiTags('Transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  //@UseGuards(AuthGuard('jwt'))
  getAllTransactions() {
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
  //@UseGuards(AuthGuard('jwt'))
  getCustomerBalance(@Param('customerId') customerId: number) {
    return this.balanceClient.send({ role: 'balance', cmd: 'get' }, customerId);
  }
}
