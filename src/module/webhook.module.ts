import { Module } from '@nestjs/common';

import { WebhookController } from 'controller';
import { PaypalClient, PaypalService, PaypalWebhookHandler } from 'service/paypal';
import { PaymentService } from 'service/payment';
import { PaymentRepository } from 'repository';

@Module({
	controllers: [WebhookController],
	providers: [PaypalWebhookHandler, PaymentService, PaymentRepository, PaypalService, PaypalClient],
})
export class WebhookModule {}
