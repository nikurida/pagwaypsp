import { Injectable, Logger } from '@nestjs/common';
import { CustomersDto } from './dto/customers.dto';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { Customers as Customers } from './entitites/customers.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : T;
type Customer = Identity<CustomersDto>;

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customers)
    private repo: Repository<Customers>,
    @InjectEntityManager()
    private mngr: EntityManager,
  ) {}

  async create(customerDto: CustomersDto): Promise<Customer> {
    try {
      const entity = this.repo.create(customerDto);
      return await this.mngr.transaction(
        async (mngr) => await mngr.save(Customers, entity),
      );
    } catch (err) {
      this.logger.error(err);
    }
  }
}
