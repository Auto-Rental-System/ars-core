import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaypalWebhookBody, PaypalWebhookHandler } from 'service/paypal';

@Controller('webhooks')
@ApiTags('Webhook')
export class WebhookController {
	constructor(private readonly paypalWebhookHandler: PaypalWebhookHandler) {}

	@Post('/paypal')
	@ApiResponse({ status: HttpStatus.OK })
	public async paypalWebhook(@Body() body: PaypalWebhookBody<any>): Promise<void> {
		// TODO: Add verify webhook signature

		await this.paypalWebhookHandler.handle(body);
	}
}
