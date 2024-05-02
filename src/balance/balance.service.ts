// balance.service.ts
import { Injectable } from '@nestjs/common';
import { Balance } from './balance';
import { PayableRepository } from 'src/payable/repositories/payable-.repository';

@Injectable()
export class BalanceService {
  constructor(private payableRepository: PayableRepository) {}

  async calculateBalance(customerId: number): Promise<Balance> {
    const payables = await this.payableRepository.find({
      where: { customerId: customerId },
    });
    let availableBalance = 0;
    let pendingBalance = 0;

    payables.forEach((payable) => {
      if (payable.status === 'settled') {
        availableBalance += payable.amount;
      } else if (payable.status === 'pending') {
        pendingBalance += payable.amount;
      }
    });

    return {
      availableBalance,
      pendingBalance,
    };
  }
}
