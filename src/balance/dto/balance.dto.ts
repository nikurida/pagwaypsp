import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BalanceDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 789, description: 'Customer ID' })
  customerId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'pending', description: 'Status of payable' })
  status: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 200.5, description: 'Amount of payable' })
  amount: number;
}
