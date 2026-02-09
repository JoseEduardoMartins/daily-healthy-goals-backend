import { registerAs } from '@nestjs/config';

export default registerAs('stripe', () => ({
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  currency: process.env.STRIPE_CURRENCY || 'brl',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
