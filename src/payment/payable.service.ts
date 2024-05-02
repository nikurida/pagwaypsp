// payable.service.ts
import { Injectable } from '@nestjs/common';
import { CreatePayableDto } from './dto/payable.dto';
import { Payable } from './payable';
import { PayableRepository } from './repository/payable-.repository';

@Injectable()
export class PayableService {
  constructor(private payableRepository: PayableRepository) {}

  async create(createPayableDto: CreatePayableDto): Promise<Payable> {
    const payable = this.payableRepository.create({
      ...createPayableDto,
      status: 'pending',
      paymentDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    });
    await this.payableRepository.save(payable);
    return this.transformToOutputDto(payable);
  }

  async findAll(): Promise<Payable[]> {
    const payables = await this.payableRepository.find();
    return payables.map((payable) => this.transformToOutputDto(payable));
  }

  private transformToOutputDto(payable: Payable): Payable {
    return {
      id: payable.id,
      status: payable.status,
      paymentDate: payable.paymentDate,
      amount: payable.amount,
    };
  }
}
