import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;

  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(0.1, { message: 'Peso deve ser maior que zero' })
  @IsNotEmpty({ message: 'Peso é obrigatório' })
  weight: number;

  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(0.1, { message: 'Altura deve ser maior que zero' })
  @IsNotEmpty({ message: 'Altura é obrigatória' })
  height: number;
}
