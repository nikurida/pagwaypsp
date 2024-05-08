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
      const { status, message, data } = await firstValueFrom(
        this.transactionsClient.send<{
          status: string;
          message: string;
          data: any;
        }>('create_transaction', transactionDto),
      );

      if (status === 'success') {
        return { status: 201, message, data };
      } else {
        throw new BadRequestException(message);
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
  async createUser(@Body() userDto: UsersDto) {
    this.logger.log(`Creating User: ${JSON.stringify(UsersDto)}`);

    try {
      const { status, message, data } = await firstValueFrom(
        this.usersClient.send<{ status: string; message: string; data: any }>(
          'create_user',
          userDto,
        ),
      );

      if (status === 'success') {
        return { status: 201, message, data };
      } else {
        throw new BadRequestException(message);
      }
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('Failed to create User');
    }
  }

  @Get('transactions')
  @ApiTags('Transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async getAllTransactions() {
    this.logger.log(`Getting Transactions...`);

    try {
      const { status, message, data } = await firstValueFrom(
        this.transactionsClient.send<{
          status: string;
          message: string;
          data: any;
        }>('get_all_transaction', {}),
      );

      if (status === 'success') {
        return { status: 201, message, data };
      } else {
        throw new BadRequestException(message);
      }
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('Failed to create User');
    }
  }

  @Get('balance/:customerId')
  @ApiTags('Balance')
  @ApiOperation({ summary: 'Get customer balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  //@UseGuards(AuthGuard('jwt'))
  async getCustomerBalance(@Param('customerId') customerId: number) {
    this.logger.log(`Getting Customer Balance...`);
    try {
      const { status, message, data } = await firstValueFrom(
        this.balanceClient.send<{ status: string; message: string; data: any }>(
          'get_customer_balance',
          customerId,
        ),
      );

      if (status === 'success') {
        return { status: 201, message, data };
      } else {
        throw new BadRequestException(message);
      }
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException('Failed to get Customer Balance');
    }
  }
}
