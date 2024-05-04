import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CustomersFee } from '../entitites/customers_fee.entity';

@Injectable()
export class CustomersFeeRepository extends Repository<CustomersFee> {
  constructor(public dataSource: DataSource) {
    super(CustomersFee, dataSource.createEntityManager());
  }
}
