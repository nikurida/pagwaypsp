import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Inject,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TransactionDto } from '../transactions/dto/transactions.dto';
import { UsersDto } from 'src/users/dto/users.dto';
import { Logger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { CustomersDto as CustomersDto } from 'src/customers/dto/customers.dto';

@Controller()
export class GatewayController {
  constructor(
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
    @Inject('TRANSACTIONS_SERVICE') private transactionsClient: ClientProxy,
    @Inject('BALANCE_SERVICE') private balanceClient: ClientProxy,
    @Inject('CUSTOMERS_SERVICE') private customerClient: ClientProxy,
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    private readonly logger: Logger,
  ) {}

  @Post('transaction')
  @ApiTags('Transactions')
  @ApiOperation({ summary: 'Create transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created' })
  @ApiBody({ type: TransactionDto })
  async createTransaction(
    @Body() transactionDto: TransactionDto,
    @Res() res: Response,
  ) {
    this.logger.log(`Creating transaction: ${JSON.stringify(transactionDto)}`);

    try {
      const result = await firstValueFrom(
        this.transactionsClient.send('create_transaction', transactionDto),
      );

      if (result) {
        return res.status(HttpStatus.CREATED).json(result);
      }

      throw new HttpException(
        'Fail to create transaction',
        HttpStatus.BAD_REQUEST,
      );
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('transactions')
  @ApiTags('Transactions')
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({ status: 200, description: 'List of transactions' })
  async getAllTransactions(@Res() res: Response) {
    this.logger.log(`Getting Transactions...`);

    try {
      const result = await firstValueFrom(
        this.transactionsClient.send('get_all_transaction', {}),
      );

      if (result) {
        return res.status(HttpStatus.OK).json(result);
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

  @Post('user')
  @ApiTags('Users')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiBody({ type: UsersDto })
  async createUser(@Body() userDto: UsersDto, @Res() res: Response) {
    this.logger.log(`Creating User: ${JSON.stringify(UsersDto)}`);

    try {
      const result = await firstValueFrom(
        this.usersClient.send('create_user', userDto),
      );

      if (result) {
        return res.status(HttpStatus.CREATED).json(result);
      }

      throw new HttpException('Fail to create user', HttpStatus.BAD_REQUEST);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Post('customer')
  @ApiTags('Customer')
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: 201, description: 'Customer created!' })
  @ApiBody({ type: CustomersDto })
  async createCustomer(
    @Body() customerDto: CustomersDto,
    @Res() res: Response,
  ) {
    this.logger.log(`Creating Customer: ${JSON.stringify(CustomersDto)}`);

    try {
      const result = await firstValueFrom(
        this.customerClient.send('create_customer', customerDto),
      );
      if (!result) {
        throw new HttpException(
          'Fail to create Customer',
          HttpStatus.BAD_REQUEST,
        );
      }
      return res.status(HttpStatus.CREATED).json(result);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('balance/:customerId')
  @ApiTags('Balance')
  @ApiOperation({ summary: 'Get customer balance' })
  @ApiResponse({ status: 200, description: 'Balance retrieved' })
  async getCustomerBalance(
    @Param('customerId') customerId: number,
    @Res() res: Response,
  ) {
    this.logger.log(`Getting Customer Balance...`);
    try {
      const result = await firstValueFrom(
        this.balanceClient.send('get_customer_balance', customerId),
      );

      if (result) {
        return res.status(HttpStatus.OK).json(result);
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

  @Post('auth/login')
  async login(@Body() data, @Res() res: Response) {
    try {
      this.logger.log(`Logging in...`);
      const auth = await firstValueFrom(
        this.authClient.send('login', { username: 'admin', password: 'admin' }),
      );
      this.logger.log(`Logged in!`);
      this.logger.log(JSON.stringify(auth));
      return res.status(HttpStatus.OK).json(auth);
    } catch (e) {
      this.logger.log(`Error logging in`);
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }
}
