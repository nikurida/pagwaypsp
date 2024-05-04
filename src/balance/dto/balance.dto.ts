import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BalanceDto {
  @IsNotEmpty()
  @IsNumber()
  customerId: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
