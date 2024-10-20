import { Injectable, Logger } from '@nestjs/common';
import { CustomersDto } from './dto/customers.dto';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';
import { Customers as CustomersEntity } from './entitites/customers.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

type Identity<T> = T extends object ? { [K in keyof T]: T[K] } : T;
type Customer = Identity<CustomersDto>;

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(
    @InjectRepository(CustomersEntity)
    private customerRepository: Repository<CustomersEntity>,
    @InjectEntityManager()
    private entityManager: EntityManager,
  ) {}

  async create(customerDto: CustomersDto): Promise<Customer> {
    const buildedCustomer = await this.buildCustomer({
      ...customerDto,
    });

    try {
      const customer = await this.entityManager.transaction(
        async (entityManager) => {
          const savedCustomer = await entityManager.save(
            CustomersEntity,
            buildedCustomer,
          );
          return savedCustomer;
        },
      );

      return customer;
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async buildCustomer(customer: CustomersDto) {
    try {
      const buildedCustomer = await this.customerRepository.create(customer);
      return buildedCustomer;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
