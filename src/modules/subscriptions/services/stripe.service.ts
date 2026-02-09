import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService implements OnModuleInit {
  private stripe: Stripe;
  private readonly currency: string;
  private readonly frontendUrl: string;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('stripe.secretKey');
    
    // Se não tiver chave, cria instância vazia (para desenvolvimento)
    if (secretKey) {
      this.stripe = new Stripe(secretKey, {
        apiVersion: '2026-01-28.clover',
      });
    } else {
      // Criar instância dummy para evitar erros em desenvolvimento
      this.stripe = null as any;
    }

    this.currency = this.configService.get<string>('stripe.currency') || 'brl';
    this.frontendUrl = this.configService.get<string>('stripe.frontendUrl') || 'http://localhost:5173';
  }

  onModuleInit() {
    // Verificar se a chave está configurada
    if (!this.configService.get<string>('stripe.secretKey')) {
      console.warn('⚠️  STRIPE_SECRET_KEY não configurada. Funcionalidades de pagamento não estarão disponíveis.');
    }
  }

  getStripe(): Stripe {
    if (!this.stripe) {
      throw new Error('Stripe não está configurado. Configure STRIPE_SECRET_KEY no .env');
    }
    return this.stripe;
  }

  async createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    return await this.stripe.customers.create({
      email,
      name,
      metadata,
    });
  }

  async createCheckoutSession(
    customerId: string,
    planName: string,
    planDescription: string,
    amount: number,
    metadata: Record<string, string>,
  ): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: this.currency,
            product_data: {
              name: planName,
              description: planDescription,
            },
            recurring: {
              interval: 'month', // Mensal
            },
            unit_amount: Math.round(amount * 100), // Stripe usa centavos
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${this.frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/profile`,
      metadata,
    });
  }

  async retrieveSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.retrieve(subscriptionId);
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd = true): Promise<Stripe.Subscription> {
    return await this.stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: cancelAtPeriodEnd,
    });
  }

  async updateSubscription(subscriptionId: string, newPlanPriceId: string): Promise<Stripe.Subscription> {
    const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
    
    return await this.stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPlanPriceId,
        },
      ],
      proration_behavior: 'always_invoice',
    });
  }

  constructWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = this.configService.get<string>('stripe.webhookSecret');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET não configurada');
    }

    return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}
