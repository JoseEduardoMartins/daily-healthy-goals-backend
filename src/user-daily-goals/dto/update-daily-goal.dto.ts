import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateDailyGoalDto {
  @IsBoolean({ message: 'is_completed deve ser um booleano' })
  @IsNotEmpty({ message: 'is_completed é obrigatório' })
  is_completed: boolean;
}
