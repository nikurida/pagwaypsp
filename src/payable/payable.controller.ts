import { Controller, Post, Body, Get } from '@nestjs/common';
import { PayableService } from './payable.service';
import { CreatePayableDto } from './dto/payable.dto';
import { Payable } from './payable';

@Controller('payables')
export class PayableController {
  constructor(private readonly payableService: PayableService) {}

  @Post()
  async create(@Body() createPayableDto: CreatePayableDto): Promise<Payable> {
    return this.payableService.create(createPayableDto);
  }

  @Get()
  async findAll(): Promise<Payable[]> {
    return this.payableService.findAll();
  }
}
