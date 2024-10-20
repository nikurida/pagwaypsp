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
    private customerRepository: Repository<Customers>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(customerDto: CustomersDto): Promise<Customer> {
    try {
      const { create } = this.customerRepository;
      const { transaction } = this.entityManager;

      const entity = create(customerDto);
      return transaction(({ save }) => save(Customers, entity));
    } catch (err) {
      this.logger.error(err);
    }
  }
}
