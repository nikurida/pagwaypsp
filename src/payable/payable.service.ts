// payable.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PayableDto } from './dto/payable.dto';
import { Payable } from './payable';
import { PayableRepository } from './repositories/payable-.repository';
import { ClientProxy } from '@nestjs/microservices';
import { CustomersFeeRepository } from 'src/customers/repositories/customers_fee.repository';

@Injectable()
export class PayableService {
  private readonly logger = new Logger(PayableService.name);

  constructor(
    private payableRepository: PayableRepository,
    private customerFeeRepository: CustomersFeeRepository,
    @Inject('BALANCE_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(payableDto: PayableDto): Promise<Payable> {
    const fee = await this.getCustomerFeeOrThrow(payableDto.customerId);

    const payableBuilded = await this.buildPayable(payableDto, fee);

    try {
      const payable = await this.payableRepository.dataSource.transaction(
        async (entityManager) => {
          const savedPayable = await entityManager.save(payableBuilded);

          return savedPayable;
        },
      );

      this.client.emit('create_balance', {
        customerId: payableDto.customerId,
        status: payable.status,
        amount: payable.amount,
      });

      return payable;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async getCustomerFeeOrThrow(customerId: number) {
    try {
      const customer = await this.customerFeeRepository.findOne({
        where: {
          customerId: customerId,
        },
        relations: {
          customer: true,
        },
      });

      return customer.fee;
    } catch (e) {
      throw new BadRequestException('Customer not found');
    }
  }

  private async buildPayable(payableDto: PayableDto, fee: number) {
    try {
      const payable = await this.payableRepository.create({
        ...payableDto,
        amount: payableDto.amount - payableDto.amount * fee,
        status: 'pending',
        paymentDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      });

      return payable;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
