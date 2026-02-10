import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreatePlanDto {
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Level é obrigatório' })
  @IsString()
  level: string; // 'bronze', 'prata', 'ouro', etc.

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Min(0, { message: 'Preço deve ser maior ou igual a zero' })
  price?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
