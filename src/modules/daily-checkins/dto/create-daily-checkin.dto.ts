import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDailyCheckinDto {
  @IsUUID('all', { message: 'pain_state_id deve ser um UUID válido' })
  @IsNotEmpty({ message: 'pain_state_id é obrigatório' })
  pain_state_id: string;
}
