import { IsInt, Min, IsEnum } from 'class-validator';
import { PayableStatus } from '../enum/payable-status.enum';

export class CreatePayableDto {
  @IsInt()
  readonly transactionId: number;

  @IsInt()
  @Min(0)
  readonly amount: number;

  @IsEnum(PayableStatus)
  readonly status: PayableStatus = PayableStatus.Pending;
}
