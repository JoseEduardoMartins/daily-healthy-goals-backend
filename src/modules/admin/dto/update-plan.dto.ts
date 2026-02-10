import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  level?: string;

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
