// payable.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PayableDto } from './dto/payable.dto';
import { Payable } from './payable';
import { PayableRepository } from './repositories/payable-.repository';
import { ClientProxy } from '@nestjs/microservices';
import { CustomersFeeRepository } from 'src/customers/repositories/customers_fee.repository';

@Injectable()
export class PayableService implements OnModuleInit {
  constructor(
    private payableRepository: PayableRepository,
    private customerFeeRepository: CustomersFeeRepository,
    @Inject('PAYABLE_SERVICE') private readonly client: ClientProxy,
  ) {}

  onModuleInit() {
    this.client.connect();
  }

  async create(payableDto: PayableDto): Promise<Payable> {
    const fee = await this.getCustomerFeeOrThrow(payableDto.customerId);

    const payableBuilded = await this.buildPayable(payableDto, fee);

    let payable: Payable;
    try {
      await this.payableRepository.dataSource.transaction(
        async (entityManager) => {
          payable = await entityManager.save(payableBuilded);

          this.client.send(
            { role: 'balance', cmd: 'create' },
            {
              customerId: payableDto.customerId,
              status: payable.status,
              amount: payable.amount,
            },
          );
        },
      );

      return payable;
    } catch (e) {
      throw new BadRequestException(e.message);
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
      throw new BadRequestException(e.message);
    }
  }
}
