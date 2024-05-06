import { IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PayableStatus } from '../enum/payable-status.enum';

export class PayableDto {
  @IsInt()
  @ApiProperty({ example: 123, description: 'Transaction ID' })
  readonly transactionId: number;

  @IsInt()
  @ApiProperty({ example: 456, description: 'Customer ID' })
  readonly customerId: number;

  @IsInt()
  @Min(0)
  @ApiProperty({ example: 100, description: 'Payable amount' })
  readonly amount: number;

  @IsEnum(PayableStatus)
  @ApiProperty({
    enum: PayableStatus,
    description: 'Payable status',
    default: PayableStatus.Pending,
  })
  readonly status?: PayableStatus = PayableStatus.Pending;
}
