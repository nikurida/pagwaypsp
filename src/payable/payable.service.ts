// payable.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreatePayableDto } from './dto/payable.dto';
import { Payable } from './payable';
import { PayableRepository } from './repositories/payable-.repository';
import {
  ClientProxy,
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CustomersFeeRepository } from 'src/customers/repositories/customers_fee.repository';

@Injectable()
export class PayableService implements OnModuleInit {
  constructor(
    private payableRepository: PayableRepository,
    private customerFeeRepository: CustomersFeeRepository,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  onModuleInit() {
    this.client.connect();
  }

  @MessagePattern('transaction_created')
  async handleTransactionCreated(
    @Payload() data: CreatePayableDto,
    @Ctx() context: RmqContext,
  ) {
    console.log(`Received transaction data: ${data}`);
    this.create(data);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  async create(createPayableDto: CreatePayableDto): Promise<Payable> {
    const fee = await this.getCustomerFeeOrThrow(createPayableDto.customerId);

    const payableBuilded = await this.buildPayable(createPayableDto, fee);

    let payable: Payable;
    try {
      this.payableRepository.dataSource.transaction(async (entityManager) => {
        payable = await entityManager.save(payableBuilded);

        this.client.emit('payable_created', payable);
      });

      return {
        id: payable.id,
        status: payable.status,
        paymentDate: payable.paymentDate,
        amount: payable.amount,
      };
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

  private async buildPayable(createPayableDto: CreatePayableDto, fee: number) {
    try {
      const payable = await this.payableRepository.create({
        ...createPayableDto,
        amount: createPayableDto.amount - createPayableDto.amount * fee,
        status: 'pending',
        paymentDate: new Date(new Date().setDate(new Date().getDate() + 30)),
      });

      return payable;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(): Promise<Payable[]> {
    const payables = await this.payableRepository.find();
    return payables.map((payable) => {
      return {
        id: payable.id,
        status: payable.status,
        paymentDate: payable.paymentDate,
        amount: payable.amount,
      };
    });
  }
}
