import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export default registerAs('database', () => {
  const config: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3308', 10),
    username: process.env.DB_USERNAME || 'app_user',
    password: process.env.DB_PASSWORD || 'app_password',
    database: process.env.DB_DATABASE || 'daily_healthy_goals',
    entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
    synchronize: process.env.NODE_ENV !== 'production', // Ativo em desenvolvimento, desabilitado em produção
    logging: process.env.NODE_ENV === 'development',
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
    migrationsRun: false,
    charset: 'utf8mb4',
    extra: {
      charset: 'utf8mb4_unicode_ci',
      connectionLimit: 10,
      connectTimeout: 60000,
      acquireTimeout: 60000,
      timeout: 60000,
    },
    timezone: 'Z', // UTC timezone
  };

  // Adicionar configuração de charset para mysql2
  (config.extra as any).typeCast = function (field: any, next: any) {
    if (field.type === 'VAR_STRING' || field.type === 'STRING' || field.type === 'TEXT') {
      return field.string();
    }
    return next();
  };

  return config;
});
