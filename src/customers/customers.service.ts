import { Injectable, Logger } from '@nestjs/common';
import { CustomersDto } from './dto/customers.dto';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { Customers as Customers } from './entitites/customers.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CustomersFee as Fee } from './entitites/customers_fee.entity';

type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : T;
type Customer = Identity<CustomersDto>;

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(Customers)
    private repo: Repository<Customers>,
    @InjectRepository(Fee)
    private feeRepo: Repository<Fee>,
    @InjectEntityManager()
    private mngr: EntityManager,
  ) {}

  async create(customerDto: CustomersDto): Promise<Customer> {
    try {
      const entity = this.repo.create(customerDto);
      const customer = await this.mngr.transaction(
        async (mngr) => await mngr.save(Customers, entity),
      );

      const feeDto = { customerId: customer.id, fee: 0.03 };
      const feeEntity = this.feeRepo.create(feeDto);
      await this.mngr.transaction(
        async (mngr) => await mngr.save(Fee, feeEntity),
      );

      return customer;
    } catch (err) {
      this.logger.error(err);
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      return await this.repo.find();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
