import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Jhon', description: 'First Name' })
  first_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Walker', description: 'Last Name' })
  last_name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '11111111111', description: 'Last Name' })
  cpf: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'walker@gmail.com', description: 'User email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'jhon_walker', description: 'Username' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'K12dd@', description: 'User password' })
  password: string;
}
