import { IsNotEmpty, IsString, IsUUID, IsOptional, IsIn } from 'class-validator';

export class CreateExerciseDto {
  @IsNotEmpty({ message: 'category_id é obrigatório' })
  @IsUUID('all', { message: 'category_id deve ser um UUID válido' })
  category_id: string;

  @IsNotEmpty({ message: 'pain_state_id é obrigatório' })
  @IsUUID('all', { message: 'pain_state_id deve ser um UUID válido' })
  pain_state_id: string;

  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image_url?: string;

  @IsOptional()
  @IsString()
  video_url?: string;

  @IsOptional()
  @IsIn(['easy', 'medium', 'hard'], { message: 'Dificuldade deve ser "easy", "medium" ou "hard"' })
  difficulty?: 'easy' | 'medium' | 'hard';

  @IsOptional()
  @IsUUID('all', { message: 'user_type_id deve ser um UUID válido' })
  user_type_id?: string | null;

  @IsOptional()
  @IsUUID('all', { message: 'plan_id deve ser um UUID válido' })
  plan_id?: string | null;
}
