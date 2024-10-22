import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerService } from './customers.service';
import { CustomersDto } from './dto/customers.dto';

const FAIL_TO_CREATE = 'Fail to create customer';
const INTERNAL_ERROR = 'Internal error';

const msgPattern = 'create_customer';

@Controller()
export class CustomersController {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly customerService: CustomerService) {}

  @MessagePattern(msgPattern)
  async createCustomer(@Payload() data: CustomersDto) {
    this.logger.log(`Received customer data: ${data}`);
    try {
      const result = await this.customerService.create(data);
      if (!result) {
        throw new HttpException(FAIL_TO_CREATE, HttpStatus.BAD_REQUEST);
      }
      return result;
    } catch (err) {
      this.logger.error(err);
      throw new HttpException(INTERNAL_ERROR, HttpStatus.BAD_REQUEST);
    }
  }
}
