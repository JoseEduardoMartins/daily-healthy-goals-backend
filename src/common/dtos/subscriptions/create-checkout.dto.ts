import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateCheckoutDto {
  @IsNotEmpty({ message: 'plan_id é obrigatório' })
  @IsUUID('all', { message: 'plan_id deve ser um UUID válido' })
  plan_id: string;
}
