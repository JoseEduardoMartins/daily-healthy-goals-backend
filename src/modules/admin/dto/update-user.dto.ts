import { IsEmail, IsNumber, Min, IsIn, IsUUID, IsOptional, IsString, IsDateString, MaxDate } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email inválido' })
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Peso deve ser um número' })
  @Min(0.1, { message: 'Peso deve ser maior que zero' })
  weight?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Altura deve ser um número' })
  @Min(0.1, { message: 'Altura deve ser maior que zero' })
  height?: number;

  @IsOptional()
  @IsDateString(undefined, { message: 'Data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  @MaxDate(new Date(), { message: 'Data de nascimento não pode ser futura' })
  birth_date?: string | null;

  @IsOptional()
  @IsIn(['admin', 'visitante', 'pagante'], { message: 'Tipo de usuário deve ser "admin", "visitante" ou "pagante"' })
  user_type?: 'admin' | 'visitante' | 'pagante';

  @IsOptional()
  @IsUUID('all', { message: 'plan_id deve ser um UUID válido' })
  plan_id?: string | null;
}
