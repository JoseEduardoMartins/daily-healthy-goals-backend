import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'Daily Healthy Goals API',
  version: process.env.APP_VERSION || '1.0.0',
  apiPrefix: process.env.API_PREFIX || '',
}));
