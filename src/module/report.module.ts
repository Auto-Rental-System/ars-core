import { Module } from '@nestjs/common';

import { ReportController } from 'controller';
import { CarService } from 'service/car';
import { PaymentService } from 'service/payment';
import { ReportFormatter } from 'service/report';
import { StorageService } from 'service/storage';
import { PaypalClient, PaypalService } from 'service/paypal';
import { CarImageRepository, CarRepository, PaymentRepository } from 'repository';

@Module({
	controllers: [
		ReportController,
		CarService,
		PaymentService,
		ReportFormatter,
		CarRepository,
		CarImageRepository,
		StorageService,
		PaymentRepository,
		PaypalService,
		PaypalClient,
	],
})
export class ReportModule {}
