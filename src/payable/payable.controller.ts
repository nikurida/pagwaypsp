import { BadRequestException, Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PayableService } from './payable.service';
import { PayableDto } from './dto/payable.dto';

@Controller()
export class PayableController {
  private readonly logger = new Logger(PayableService.name);

  constructor(private readonly payableService: PayableService) {}

  @MessagePattern('create_payable')
  async handleCreatePayable(@Payload() data: PayableDto) {
    this.logger.log(`Received payable data: ${data}`);
    try {
      const result = await this.payableService.create(data);

      if (result) {
        return {
          status: 'success',
          message: 'Payable created',
          data: result,
        };
      }

      throw new BadRequestException();
    } catch (e) {
      this.logger.error(e);
      return { status: 'error', message: 'Fail to create Payable' };
    }
  }
}
