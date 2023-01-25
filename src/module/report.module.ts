import { Module } from '@nestjs/common';

import { ReportController } from 'controller';
import { CarFormatter, CarService } from 'service/car';
import { PaymentFormatter, PaymentService } from 'service/payment';
import { ReportFormatter } from 'service/report';
import { StorageService } from 'service/storage';
import { PaypalClient, PaypalService } from 'service/paypal';
import { RentalService } from 'service/rental';
import { UserService } from 'service/user';
import { AuthService } from 'service/auth';
import {
	CarImageRepository,
	CarRepository,
	PaymentRepository,
	RentalOrderRepository,
	UserRepository,
} from 'repository';

@Module({
	controllers: [ReportController],
	providers: [
		CarService,
		PaymentService,
		ReportFormatter,
		CarRepository,
		CarImageRepository,
		CarFormatter,
		StorageService,
		PaymentRepository,
		PaymentFormatter,
		PaypalService,
		PaypalClient,
		RentalService,
		RentalOrderRepository,
		UserService,
		UserRepository,
		AuthService,
	],
})
export class ReportModule {}
