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
  UseGuards,
  Req,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { TransactionDto } from '../transactions/dto/transactions.dto';
import { UsersDto } from 'src/users/dto/users.dto';
import { Logger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';
import { CustomersDto as CustomersDto } from 'src/customers/dto/customers.dto';
import { JwtService } from '@nestjs/jwt';
import { CookieGuard } from 'src/auth/CookieGuard.guard';

@Controller()
export class GatewayController {
  constructor(
    @Inject('USERS_SERVICE') private usersClient: ClientProxy,
    @Inject('TRANSACTIONS_SERVICE') private transactionsClient: ClientProxy,
    @Inject('BALANCE_SERVICE') private balanceClient: ClientProxy,
    @Inject('CUSTOMERS_SERVICE') private customerClient: ClientProxy,
    private readonly logger: Logger,
    private readonly jwtService: JwtService,
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

  @Get('customers')
  @ApiTags('Customers')
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of customers' })
  async getAllCustomers(@Res() res: Response) {
    this.logger.log(`Getting Customers...`);

    try {
      const result = await firstValueFrom(
        this.customerClient.send('get_all_customers', {}),
      );

      if (result) {
        return res.status(HttpStatus.OK).json(result);
      }

      throw new HttpException('Fail to get customers', HttpStatus.BAD_REQUEST);
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
  @UseGuards(CookieGuard)
  async getCustomerBalance(
    @Param('customerId') customerId: number,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      this.logger.log(`Getting Customer Balance...`);

      if (!(req as any).cookies.jwt) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

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
  @ApiBody({ type: () => ({ username: 'denis' }) })
  @ApiOperation({ summary: 'Get user access token' })
  @ApiResponse({ status: 200, description: 'Access token granted' })
  async login(
    @Body() { username }: { username: string },
    @Res() res: Response,
  ) {
    try {
      this.logger.log(`Finding user: ${username}`);
      const result = await firstValueFrom(
        this.usersClient.send('find_user', username),
      ).catch((e) => {
        this.logger.error(e);
        return null;
      });

      if (!result) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'User not found' });
      }

      const token = this.jwtService.sign({ username });

      return res
        .cookie('jwt', token, {
          httpOnly: true, // Não permite que o JavaScript do navegador acesse o cookie
          sameSite: 'strict', // Para evitar CSRF (pode ser 'lax' ou 'none' dependendo do caso de uso)
          maxAge: 24 * 60 * 60 * 1000, // Define a duração do cookie (ex: 24 horas)
        })
        .status(HttpStatus.OK)
        .json({ token });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('auth/me')
  async me(@Req() req: Request, @Res() res: Response) {
    try {
      const token = (req as { cookies?: Record<string, string> })?.cookies.jwt;

      if (!token) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'Unauthorized' });
      }

      const { username } = this.jwtService.verify(token);
      return res.status(HttpStatus.OK).json({ username });
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal Error', HttpStatus.BAD_GATEWAY);
    }
  }

  @Get('auth/logout')
  async logout(@Res() res: Response) {
    return res
      .clearCookie('jwt')
      .status(HttpStatus.OK)
      .json({ message: 'Logged out' });
  }
}
