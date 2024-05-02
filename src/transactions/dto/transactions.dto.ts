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

export class CreateTransactionDto {
  @IsNumber()
  @Min(0.01)
  readonly amount: number;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsCreditCard()
  readonly cardNumber: string;

  @IsNotEmpty()
  @IsString()
  readonly cardholderName: string;

  @IsDate()
  @Type(() => Date)
  readonly cardExpirationDate: Date;

  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  readonly cvv: string;
}
