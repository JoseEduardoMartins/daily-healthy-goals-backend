import { registerDecorator, ValidationOptions } from 'class-validator';

/** Data mínima considerada como "hoje" - evita rejeitar datas por relógio do servidor no passado */
const MIN_TODAY = new Date(Date.UTC(2020, 0, 1)); // 2020-01-01 UTC

/**
 * Valida que a data (string YYYY-MM-DD ou Date) não é futura.
 * Compara apenas o dia (sem hora). Usa "hoje" no momento da validação, com um piso
 * (2020-01-01) para não rejeitar datas válidas quando o relógio do servidor está errado.
 */
export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (value == null) return true; // deixar @IsNotEmpty tratar
          // Normaliza string para YYYY-MM-DD (UTC) para evitar timezone/parsing
          const date =
            typeof value === 'string'
              ? new Date(String(value).trim().slice(0, 10) + 'T12:00:00.000Z') // meio-dia UTC evita bordas de timezone
              : new Date(value as string | number | Date);
          if (isNaN(date.getTime())) return false;
          const now = new Date();
          const todayDateOnly = new Date(
            Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
          );
          // Se o relógio do servidor estiver no passado, usa um "hoje" mínimo
          const effectiveToday =
            todayDateOnly.getTime() < MIN_TODAY.getTime() ? MIN_TODAY : todayDateOnly;
          const valueDateOnly = new Date(
            Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
          );
          return valueDateOnly.getTime() <= effectiveToday.getTime();
        },
        defaultMessage() {
          return (
            (validationOptions?.message as string) || 'Data de nascimento não pode ser futura'
          );
        },
      },
    });
  };
}
