import { IsString, IsUUID, IsOptional, IsIn, IsInt, Min, Max } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsUUID('all', { message: 'category_id deve ser um UUID válido' })
  category_id?: string;

  @IsOptional()
  @IsUUID('all', { message: 'pain_state_id deve ser um UUID válido' })
  pain_state_id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  moment_of_day?: string;

  @IsOptional()
  @IsString()
  benefits?: string;

  @IsOptional()
  @IsString()
  recipe_prep?: string;

  @IsOptional()
  @IsUUID('all', { message: 'user_type_id deve ser um UUID válido' })
  user_type_id?: string | null;

  @IsOptional()
  @IsUUID('all', { message: 'plan_id deve ser um UUID válido' })
  plan_id?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  min_age?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  max_age?: number | null;
}
