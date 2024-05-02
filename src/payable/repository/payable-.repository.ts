import { DataSource, Repository } from 'typeorm';
import { Payable } from '../entities/payable.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PayableRepository extends Repository<Payable> {
  constructor(public dataSource: DataSource) {
    super(Payable, dataSource.createEntityManager());
  }
}
