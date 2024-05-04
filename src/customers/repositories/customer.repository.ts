import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Customers } from '../entitites/customers.entity';

@Injectable()
export class CustomerRepository extends Repository<Customers> {
  constructor(public dataSource: DataSource) {
    super(Customers, dataSource.createEntityManager());
  }
}
