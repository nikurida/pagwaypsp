import { DataSource, Repository } from 'typeorm';
import { Balance } from '../entities/balance.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceRepository extends Repository<Balance> {
  constructor(public dataSource: DataSource) {
    super(Balance, dataSource.createEntityManager());
  }
}
