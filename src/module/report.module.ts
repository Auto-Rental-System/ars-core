import { Module } from '@nestjs/common';

import { ReportController } from 'controller';
import { CarService } from 'service/car';
import { PaymentService } from 'service/payment';
import { ReportFormatter } from 'service/report';
import { StorageService } from 'service/storage';
import { PaypalClient, PaypalService } from 'service/paypal';
import { RentalService } from 'service/rental';
import { CarImageRepository, CarRepository, PaymentRepository, RentalOrderRepository } from 'repository';

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
		RentalService,
		RentalOrderRepository,
	],
})
export class ReportModule {}
