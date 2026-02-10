import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Query,
  RawBodyRequest,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { CreateCheckoutDto } from '../../common/dtos/subscriptions/create-checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StripeService } from './services/stripe.service';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(
    private readonly subscriptionsService: SubscriptionsService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('create-checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Criar sessão de checkout para assinatura' })
  @ApiBody({ type: CreateCheckoutDto })
  @ApiResponse({ status: 200, description: 'URL de checkout criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Plano inválido ou não ativo' })
  @ApiResponse({ status: 409, description: 'Usuário já possui assinatura ativa' })
  async createCheckout(
    @CurrentUser() user: CurrentUserPayload,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Usuário não autenticado. Token JWT inválido ou não fornecido.',
      );
    }

    return await this.subscriptionsService.createCheckoutSession(user.id, createCheckoutDto);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter status da assinatura do usuário' })
  @ApiResponse({ status: 200, description: 'Status da assinatura' })
  async getStatus(@CurrentUser() user: CurrentUserPayload) {
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Usuário não autenticado. Token JWT inválido ou não fornecido.',
      );
    }

    return await this.subscriptionsService.getSubscriptionStatus(user.id);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelar assinatura atual' })
  @ApiResponse({ status: 200, description: 'Assinatura cancelada com sucesso' })
  @ApiResponse({ status: 404, description: 'Assinatura não encontrada' })
  async cancel(@CurrentUser() user: CurrentUserPayload) {
    if (!user || !user.id) {
      throw new UnauthorizedException(
        'Usuário não autenticado. Token JWT inválido ou não fornecido.',
      );
    }

    return await this.subscriptionsService.cancelSubscription(user.id);
  }

  @Get('success')
  @ApiOperation({ summary: 'Confirmar pagamento após checkout do Stripe' })
  @ApiQuery({ name: 'session_id', description: 'ID da sessão de checkout do Stripe' })
  @ApiResponse({ status: 302, description: 'Redireciona para /profile no frontend' })
  async confirmPayment(@Query('session_id') sessionId: string, @Res() res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (!sessionId) {
      // Se não tiver session_id, redireciona para perfil com erro
      return res.redirect(`${frontendUrl}/profile?payment_error=missing_session`);
    }

    try {
      // Buscar a sessão no Stripe para validar
      const session = await this.stripeService.getStripe().checkout.sessions.retrieve(sessionId);

      // Verificar se o pagamento foi bem-sucedido
      if (session.payment_status === 'paid' && session.status === 'complete') {
        // Verificar se a subscription já foi processada pelo webhook
        const subscription = await this.subscriptionsService.findByStripeSubscriptionId(
          session.subscription as string,
        );

        if (subscription) {
          // Pagamento confirmado e processado - redireciona para perfil com sucesso
          return res.redirect(
            `${frontendUrl}/profile?payment_success=true&session_id=${sessionId}`,
          );
        } else {
          // Pagamento confirmado mas ainda processando (webhook pode estar em andamento)
          // Aguardar alguns segundos e redirecionar para perfil (frontend pode fazer polling)
          return res.redirect(
            `${frontendUrl}/profile?payment_processing=true&session_id=${sessionId}`,
          );
        }
      } else {
        // Pagamento não foi concluído - redireciona para perfil com erro
        return res.redirect(
          `${frontendUrl}/profile?payment_error=not_completed&session_id=${sessionId}`,
        );
      }
    } catch (error) {
      this.logger.error(`Erro ao confirmar pagamento: ${error.message}`);
      return res.redirect(
        `${frontendUrl}/profile?payment_error=validation_failed&session_id=${sessionId}`,
      );
    }
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook do Stripe para eventos de pagamento' })
  @ApiResponse({ status: 200, description: 'Webhook processado com sucesso' })
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log('🔔 Webhook recebido do Stripe');

    const payload = req.rawBody;
    if (!payload) {
      console.error('❌ Payload vazio');
      throw new Error('Payload vazio');
    }

    if (!signature) {
      console.error('❌ Assinatura do Stripe não encontrada');
      throw new Error('Assinatura do Stripe não encontrada');
    }

    let event: Stripe.Event;
    try {
      event = this.stripeService.constructWebhookEvent(payload, signature);
      console.log(`✅ Evento recebido: ${event.type}`);
    } catch (err) {
      console.error(`❌ Erro na verificação da assinatura: ${err.message}`);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Processar eventos
    const eventType = event.type as string;
    switch (eventType) {
      case 'checkout.session.completed':
        this.logger.log('📝 Processando checkout.session.completed');
        try {
          const result = await this.subscriptionsService.handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session,
          );
          if (result) {
            this.logger.log('✅ checkout.session.completed processado com sucesso');
          } else {
            this.logger.warn(
              '⚠️ checkout.session.completed ignorado (evento de teste sem metadata)',
            );
          }
        } catch (error) {
          this.logger.error(`❌ Erro ao processar checkout.session.completed: ${error.message}`);
          throw error; // Re-throw para que o Stripe saiba que houve erro
        }
        break;

      case 'invoice.payment_succeeded':
        console.log('💳 Processando invoice.payment_succeeded');
        await this.subscriptionsService.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        console.log('✅ invoice.payment_succeeded processado com sucesso');
        break;

      case 'invoice_payment.paid': // Versão mais recente da API (2026-01-28.clover)
        console.log('💳 Processando invoice_payment.paid');
        await this.subscriptionsService.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        console.log('✅ invoice_payment.paid processado com sucesso');
        break;

      case 'invoice.payment_failed':
        console.log('⚠️ Processando pagamento falhado');
        await this.subscriptionsService.handlePaymentFailed(event.data.object as Stripe.Invoice);
        console.log('✅ Falha de pagamento processada');
        break;

      case 'customer.subscription.deleted':
        console.log('🗑️ Processando customer.subscription.deleted');
        await this.subscriptionsService.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        console.log('✅ customer.subscription.deleted processado com sucesso');
        break;

      case 'customer.subscription.updated':
        console.log('🔄 Processando customer.subscription.updated');
        await this.subscriptionsService.handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        console.log('✅ customer.subscription.updated processado com sucesso');
        break;

      default:
        console.log(`⚠️ Evento não tratado: ${event.type}`);
    }

    console.log('✅ Webhook processado com sucesso');
    return { received: true };
  }
}
