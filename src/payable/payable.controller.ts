import { Controller, HttpException, HttpStatus, Logger } from '@nestjs/common';
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
        return result;
      }

      throw new HttpException('Fail to create Payable', HttpStatus.BAD_REQUEST);
    } catch (e) {
      this.logger.error(e);
      throw new HttpException('Internal error', HttpStatus.BAD_REQUEST);
    }
  }
}
