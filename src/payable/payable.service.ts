// payable.service.ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { PayableDto } from './dto/payable.dto';
import { Payable } from './payable';
import { Payable as PayableEntity } from './entities/payable.entity';
import { ClientProxy } from '@nestjs/microservices';
import { EntityManager, Repository } from 'typeorm';
import { CustomersFee as CustomersFeeEntity } from 'src/customers/entitites/customers_fee.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PayableService {
  private readonly logger = new Logger(PayableService.name);

  constructor(
    @InjectRepository(PayableEntity)
    private payableRepository: Repository<PayableEntity>,
    @InjectRepository(CustomersFeeEntity)
    private customerFeeRepository: Repository<CustomersFeeEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
    @Inject('BALANCE_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(payableDto: PayableDto): Promise<Payable | boolean> {
    const fee = await this.getCustomerFeeOrThrow(payableDto.customerId);

    const payableBuilded = await this.buildPayable(payableDto, fee);

    try {
      const data = await this.entityManager.transaction(
        async (entityManager) => {
          const savedPayable = await entityManager.save(
            PayableEntity,
            payableBuilded,
          );

          return savedPayable;
        },
      );

      const { status, message } = await firstValueFrom(
        this.client.send<{ status: string; message: string; data: any }>(
          'create_balance',
          {
            customerId: data.customerId,
            status: data.status,
            amount: data.amount,
          },
        ),
      );

      if (status === 'success') {
        return data;
      } else {
        this.logger.error(message);
        return false;
      }
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
      this.logger.error(e);
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
