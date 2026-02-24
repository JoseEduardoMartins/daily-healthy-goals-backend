import { IsEmail, IsNotEmpty, IsNumber, Min, IsIn, IsUUID, ValidateIf, IsDateString, MaxDate } from 'class-validator';

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

  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  @IsDateString(undefined, { message: 'Data de nascimento deve ser uma data válida (YYYY-MM-DD)' })
  @MaxDate(new Date(), { message: 'Data de nascimento não pode ser futura' })
  birth_date: string;

  @IsNotEmpty({ message: 'Tipo de usuário é obrigatório' })
  @IsIn(['visitante', 'pagante'], { message: 'Tipo de usuário deve ser "visitante" ou "pagante". Admin não pode ser cadastrado por segurança.' })
  user_type: 'visitante' | 'pagante';

  @ValidateIf((o) => o.user_type === 'pagante')
  @IsNotEmpty({ message: 'Plano é obrigatório para usuários pagantes' })
  @IsUUID('all', { message: 'plan_id deve ser um UUID válido' })
  plan_id?: string | null;
}
