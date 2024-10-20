import {
  IsInt,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PayableStatus } from '../enum/payable-status.enum';

export class PayableDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 123, description: 'Transaction ID' })
  transactionId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 456, description: 'Customer ID' })
  customerId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 200.5, description: 'Amount of payable' })
  amount: number;

  @IsEnum(PayableStatus)
  @IsOptional()
  @ApiProperty({
    enum: PayableStatus,
    description: 'Payable status',
    default: PayableStatus.Pending,
  })
  status?: PayableStatus = PayableStatus.Pending;
}
