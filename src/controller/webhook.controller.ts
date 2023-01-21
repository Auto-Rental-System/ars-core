import { Body, Req, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaypalService, PaypalWebhookBody, PaypalWebhookHandler } from 'service/paypal';
import { FastifyRequest } from 'fastify';

@Controller('webhooks')
@ApiTags('Webhook')
export class WebhookController {
	constructor(
		private readonly paypalWebhookHandler: PaypalWebhookHandler,
		private readonly paypalService: PaypalService,
	) {}

	@Post('/paypal')
	@ApiResponse({ status: HttpStatus.OK })
	public async paypalWebhook(@Req() req: FastifyRequest, @Body() body: PaypalWebhookBody<any>): Promise<void> {
		await this.paypalService.verifyWebhook(req);

		await this.paypalWebhookHandler.handle(body);
	}
}
