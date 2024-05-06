import {
  IsNotEmpty,
  IsString,
  Length,
  IsNumber,
  Min,
  IsDate,
  IsCreditCard,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 123, description: 'Customer ID' })
  customerId: number;

  @IsNumber()
  @Min(0.01)
  @ApiProperty({ example: 50.75, description: 'Transaction amount' })
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Smartband XYZ 3.0',
    description: 'Transaction description',
  })
  readonly description: string;

  @IsCreditCard()
  @ApiProperty({
    example: '4111111111111111',
    description: 'Credit card number',
  })
  readonly cardNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'John Doe', description: 'Cardholder name' })
  readonly cardholderName: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    example: '10/26',
    description: 'Card expiration date',
    type: 'string',
  })
  readonly cardExpirationDate: Date;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  @ApiProperty({ example: '123', description: 'Card CVV' })
  readonly cvv: string;
}
