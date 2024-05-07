import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PayableService } from './payable.service';
import { PayableDto } from './dto/payable.dto';

@Controller()
export class PayableController {
  private readonly logger = new Logger(PayableService.name);

  constructor(private readonly payableService: PayableService) {}

  @EventPattern('create_payable')
  async createPayable(@Payload() data: PayableDto) {
    this.logger.log(`Received payable data: ${data}`);
    try {
      const response = await this.payableService.create(data);
      return response;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
