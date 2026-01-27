import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateDailyCheckinDto {
  @IsNumber({}, { message: 'category_id deve ser um número' })
  @IsNotEmpty({ message: 'category_id é obrigatório' })
  category_id: number;
}
