import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PayableService } from './payable.service';
import { PayableDto } from './dto/payable.dto';

@Controller()
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @MessagePattern({ role: 'payable', cmd: 'create' })
  async createPayable(@Payload() data: PayableDto) {
    console.log(`Received payable data: ${data}`);

    return this.payableService.create(data);
  }
}
