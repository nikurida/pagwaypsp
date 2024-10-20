import { IsString, IsNumber, IsArray } from 'class-validator';
import { Transactions } from 'src/transactions/entities/transaction.entity';
import { Payable } from 'src/payable/entities/payable.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CustomersDto {
  @IsString()
  @ApiProperty({ example: 'Jhon', description: 'First Name' })
  name: string;

  @IsNumber()
  @ApiProperty({ example: 11111111111, description: 'Customer CPF' })
  cpf: number;

  @IsString()
  @ApiProperty({ example: 'active', description: 'Customer status' })
  status: string;

  @IsArray()
  @ApiProperty({
    example: [],
    description: 'Customer transactions',
  })
  transactions: Transactions[];

  @IsArray()
  @ApiProperty({ example: [], description: 'Customer payables' })
  payable: Payable[];
}
