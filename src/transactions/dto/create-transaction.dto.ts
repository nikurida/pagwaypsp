import { IsString, IsNumber, IsDate, Length } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  valor: number;

  @IsString()
  descricao: string;

  @IsString()
  @Length(16, 16)
  numeroCartao: string;

  @IsString()
  nomePortador: string;

  @IsDate()
  dataValidade: Date;

  @IsString()
  @Length(3, 3)
  codigoVerificacao: string;
}
