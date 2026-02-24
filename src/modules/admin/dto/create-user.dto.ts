import { IsEmail, IsNotEmpty, IsNumber, Min, IsIn, IsUUID, IsOptional, IsString, IsDateString } from 'class-validator';
import { IsNotFutureDate } from '../../../common/validators/not-future-date.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  password: string;

  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(0.1, { message: 'Peso deve ser maior que zero' })
  @IsNotEmpty({ message: 'Peso é obrigatório' })
  weight: number;

  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(0.1, { message: 'Altura deve ser maior que zero' })
  @IsNotEmpty({ message: 'Altura é obrigatória' })
  height: number;

  @IsOptional()
  @IsDateString(undefined, { message: 'Data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  @IsNotFutureDate({ message: 'Data de nascimento não pode ser futura' })
  birth_date?: string | null;

  @IsNotEmpty({ message: 'Tipo de usuário é obrigatório' })
  @IsIn(['admin', 'visitante', 'pagante'], { message: 'Tipo de usuário deve ser "admin", "visitante" ou "pagante"' })
  user_type: 'admin' | 'visitante' | 'pagante';

  @IsOptional()
  @IsUUID('all', { message: 'plan_id deve ser um UUID válido' })
  plan_id?: string | null;
}
