import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { CreateCheckoutDto } from '../../common/dtos/subscriptions/create-checkout.dto';
import { PlansService } from '../plans/plans.service';
import { UsersService } from '../users/users.service';
import { PaymentHistory, PaymentStatus } from './entities/payment-history.entity';
import {
  Subscription as SubscriptionEntity,
  SubscriptionStatus,
} from './entities/subscription.entity';
import { StripeService } from './services/stripe.service';

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  constructor(
    @InjectRepository(SubscriptionEntity)
    private subscriptionsRepository: Repository<SubscriptionEntity>,
    @InjectRepository(PaymentHistory)
    private paymentHistoryRepository: Repository<PaymentHistory>,
    private usersService: UsersService,
    private plansService: PlansService,
    private stripeService: StripeService,
  ) {}

  async createCheckoutSession(userId: string, createCheckoutDto: CreateCheckoutDto) {
    const user = await this.usersService.findOne(userId);
    const plan = await this.plansService.findOne(createCheckoutDto.plan_id);

    if (!plan.is_active) {
      throw new BadRequestException('Plano não está ativo');
    }

    // Verificar se usuário já tem assinatura ativa
    const activeSubscription = await this.findActiveSubscriptionByUserId(userId);
    if (activeSubscription) {
      throw new ConflictException('Usuário já possui uma assinatura ativa');
    }

    // Criar ou buscar customer no Stripe
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await this.stripeService.createCustomer(user.email, user.name, {
        userId: user.id,
      });
      customerId = customer.id;
      await this.usersService.updateStripeCustomerId(user.id, customerId);
    }

    // Criar sessão de checkout
    const session = await this.stripeService.createCheckoutSession(
      customerId,
      plan.name,
      plan.description || '',
      Number(plan.price),
      {
        userId: user.id,
        planId: plan.id,
      },
    );

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  }

  async findActiveSubscriptionByUserId(userId: string): Promise<SubscriptionEntity | null> {
    return await this.subscriptionsRepository.findOne({
      where: {
        user_id: userId,
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['plan'],
      order: { created_at: 'DESC' },
    });
  }

  async findByUserId(userId: string): Promise<SubscriptionEntity[]> {
    return await this.subscriptionsRepository.find({
      where: { user_id: userId },
      relations: ['plan'],
      order: { created_at: 'DESC' },
    });
  }

  async findByStripeSubscriptionId(
    stripeSubscriptionId: string,
  ): Promise<SubscriptionEntity | null> {
    return await this.subscriptionsRepository.findOne({
      where: { stripe_subscription_id: stripeSubscriptionId },
      relations: ['user', 'plan'],
    });
  }

  async getSubscriptionStatus(userId: string) {
    const subscription = await this.findActiveSubscriptionByUserId(userId);
    const user = await this.usersService.findOne(userId);

    return {
      hasActiveSubscription: !!subscription,
      subscription: subscription
        ? {
            id: subscription.id,
            plan: {
              id: subscription.plan.id,
              name: subscription.plan.name,
              level: subscription.plan.level,
            },
            status: subscription.status,
            current_period_start: subscription.current_period_start,
            current_period_end: subscription.current_period_end,
            cancel_at_period_end: subscription.cancel_at_period_end,
          }
        : null,
      user: {
        subscription_status: user.subscription_status,
        subscription_expires_at: user.subscription_expires_at,
        plan_id: user.plan_id,
      },
    };
  }

  async handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
  ): Promise<SubscriptionEntity | null> {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;

    // Se não houver metadata, pode ser um evento de teste do Stripe CLI
    // Nesse caso, tentamos buscar a subscription pelo subscription_id
    if (!userId || !planId) {
      this.logger.warn(
        `⚠️ Metadata não encontrada na sessão de checkout (pode ser evento de teste). Session ID: ${session.id}`,
      );

      const subscriptionId = session.subscription as string;
      if (subscriptionId) {
        // Tentar buscar subscription existente pelo Stripe subscription ID
        const existingSubscription = await this.findByStripeSubscriptionId(subscriptionId);
        if (existingSubscription) {
          this.logger.log(
            `✅ Subscription já existe no banco para Stripe Subscription ID: ${subscriptionId}. Pulando criação.`,
          );
          return existingSubscription;
        }
      }

      // Se não encontrou subscription existente e não tem metadata, não podemos processar
      this.logger.warn(
        `⚠️ Não é possível processar checkout.session.completed sem metadata e sem subscription existente. Session ID: ${session.id}`,
      );
      return null; // Retorna null em vez de lançar erro para não quebrar o webhook
    }

    const subscriptionId = session.subscription as string;
    if (!subscriptionId) {
      this.logger.error(`Subscription ID não encontrado na sessão: ${session.id}`);
      throw new Error('Subscription ID não encontrado na sessão');
    }

    // Buscar subscription do Stripe
    const stripeSubscription = await this.stripeService.retrieveSubscription(subscriptionId);

    // Criar ou atualizar subscription no banco
    const user = await this.usersService.findOne(userId);
    const plan = await this.plansService.findOne(planId);

    let subscription: SubscriptionEntity | null = await this.subscriptionsRepository.findOne({
      where: { stripe_subscription_id: subscriptionId },
    });

    if (subscription) {
      // Atualizar subscription existente
      const dbSub = subscription as SubscriptionEntity;
      const stripeSub = stripeSubscription as any;
      dbSub.status = this.mapStripeStatusToSubscriptionStatus(stripeSub.status);
      dbSub.current_period_start = new Date(stripeSub.current_period_start * 1000);
      dbSub.current_period_end = new Date(stripeSub.current_period_end * 1000);
      dbSub.cancel_at_period_end = stripeSub.cancel_at_period_end || false;
    } else {
      // Criar nova subscription
      const stripeSub = stripeSubscription as any;
      subscription = this.subscriptionsRepository.create({
        user_id: userId,
        plan_id: planId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: stripeSub.customer as string,
        status: this.mapStripeStatusToSubscriptionStatus(stripeSub.status),
        current_period_start: new Date(stripeSub.current_period_start * 1000),
        current_period_end: new Date(stripeSub.current_period_end * 1000),
        cancel_at_period_end: stripeSub.cancel_at_period_end || false,
      });
    }

    subscription = await this.subscriptionsRepository.save(subscription);

    // Atualizar usuário
    await this.usersService.updateSubscription(
      userId,
      planId,
      subscription.status,
      subscription.current_period_end,
    );

    return subscription;
  }

  async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    // invoice.subscription pode ser string (ID) ou objeto Subscription expandido
    const invoiceData = invoice as any;
    let subscriptionId: string | null = null;
    if (typeof invoiceData.subscription === 'string') {
      subscriptionId = invoiceData.subscription;
    } else if (invoiceData.subscription && typeof invoiceData.subscription === 'object') {
      subscriptionId = invoiceData.subscription.id || null;
    }

    if (!subscriptionId) {
      return;
    }

    const subscription: SubscriptionEntity | null =
      await this.findByStripeSubscriptionId(subscriptionId);
    if (!subscription) {
      return;
    }

    // Atualizar subscription
    const stripeSub = (await this.stripeService.retrieveSubscription(subscriptionId)) as any;
    const dbSub = subscription as SubscriptionEntity;
    dbSub.status = this.mapStripeStatusToSubscriptionStatus(stripeSub.status);
    dbSub.current_period_start = new Date(stripeSub.current_period_start * 1000);
    dbSub.current_period_end = new Date(stripeSub.current_period_end * 1000);
    await this.subscriptionsRepository.save(dbSub);

    // Atualizar usuário
    await this.usersService.updateSubscription(
      dbSub.user_id,
      dbSub.plan_id,
      dbSub.status,
      dbSub.current_period_end,
    );

    // Registrar pagamento no histórico
    await this.paymentHistoryRepository.save({
      subscription_id: subscription.id,
      stripe_invoice_id: invoice.id,
      amount: Number(invoice.amount_paid) / 100, // Converter de centavos
      currency: invoice.currency.toUpperCase(),
      status: PaymentStatus.PAID,
      paid_at: new Date(invoice.status_transitions.paid_at * 1000),
    });
  }

  async handlePaymentFailed(invoice: Stripe.Invoice) {
    // invoice.subscription pode ser string (ID) ou objeto Subscription expandido
    const invoiceData = invoice as any;
    let subscriptionId: string | null = null;
    if (typeof invoiceData.subscription === 'string') {
      subscriptionId = invoiceData.subscription;
    } else if (invoiceData.subscription && typeof invoiceData.subscription === 'object') {
      subscriptionId = invoiceData.subscription.id || null;
    }

    if (!subscriptionId) {
      return;
    }

    const subscription: SubscriptionEntity | null =
      await this.findByStripeSubscriptionId(subscriptionId);
    if (!subscription) {
      return;
    }

    // Atualizar status para past_due
    subscription.status = SubscriptionStatus.PAST_DUE;
    await this.subscriptionsRepository.save(subscription);

    // Atualizar usuário
    await this.usersService.updateSubscriptionStatus(
      subscription.user_id,
      SubscriptionStatus.PAST_DUE,
    );

    // Registrar falha no histórico
    await this.paymentHistoryRepository.save({
      subscription_id: subscription.id,
      stripe_invoice_id: invoice.id,
      amount: Number(invoice.amount_due) / 100,
      currency: invoice.currency.toUpperCase(),
      status: PaymentStatus.FAILED,
    });
  }

  async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription: SubscriptionEntity | null = await this.findByStripeSubscriptionId(
      stripeSubscription.id,
    );
    if (!subscription) {
      return;
    }

    // Atualizar status para canceled
    subscription.status = SubscriptionStatus.CANCELED;
    await this.subscriptionsRepository.save(subscription);

    // Atualizar usuário (downgrade para visitante)
    await this.usersService.cancelSubscription(subscription.user_id);
  }

  async handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
    const subscription: SubscriptionEntity | null = await this.findByStripeSubscriptionId(
      stripeSubscription.id,
    );
    if (!subscription) {
      return;
    }

    // Atualizar subscription
    const stripeSub = stripeSubscription as any;
    const dbSub = subscription as SubscriptionEntity;
    dbSub.status = this.mapStripeStatusToSubscriptionStatus(stripeSub.status);
    dbSub.current_period_start = new Date(stripeSub.current_period_start * 1000);
    dbSub.current_period_end = new Date(stripeSub.current_period_end * 1000);
    dbSub.cancel_at_period_end = stripeSub.cancel_at_period_end || false;
    await this.subscriptionsRepository.save(dbSub);

    // Atualizar usuário
    await this.usersService.updateSubscription(
      dbSub.user_id,
      dbSub.plan_id,
      dbSub.status,
      dbSub.current_period_end,
    );
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.findActiveSubscriptionByUserId(userId);
    if (!subscription) {
      throw new NotFoundException('Assinatura ativa não encontrada');
    }

    if (!subscription.stripe_subscription_id) {
      throw new BadRequestException('Subscription ID do Stripe não encontrado');
    }

    // Cancelar no Stripe
    await this.stripeService.cancelSubscription(subscription.stripe_subscription_id, true);

    // Atualizar localmente
    subscription.cancel_at_period_end = true;
    await this.subscriptionsRepository.save(subscription);

    return { message: 'Assinatura será cancelada ao final do período atual' };
  }

  private mapStripeStatusToSubscriptionStatus(
    stripeStatus: Stripe.Subscription.Status,
  ): SubscriptionStatus {
    const statusMap: Record<string, SubscriptionStatus> = {
      active: SubscriptionStatus.ACTIVE,
      canceled: SubscriptionStatus.CANCELED,
      past_due: SubscriptionStatus.PAST_DUE,
      trialing: SubscriptionStatus.TRIALING,
      incomplete: SubscriptionStatus.PAST_DUE,
      incomplete_expired: SubscriptionStatus.EXPIRED,
      unpaid: SubscriptionStatus.PAST_DUE,
    };

    return statusMap[stripeStatus] || SubscriptionStatus.EXPIRED;
  }
}
