import { Module } from '@nestjs/common';

import { PayoutCron } from 'cron/payout.cron';
import { CarService } from 'service/car';
import { RentalService } from 'service/rental';
import { UserService } from 'service/user';
import { PaymentService } from 'service/payment';
import { PaypalClient, PaypalService } from 'service/paypal';
import { StorageService } from 'service/storage';
import { AuthService } from 'service/auth';
import {
	CarImageRepository,
	CarRepository,
	PaymentRepository,
	RentalOrderRepository,
	UserRepository,
} from 'repository';

@Module({
	providers: [
		PayoutCron,
		RentalService,
		CarService,
		UserService,
		PaymentService,
		PaypalService,
		StorageService,
		AuthService,
		PaypalClient,
		CarImageRepository,
		UserRepository,
		RentalOrderRepository,
		PaymentRepository,
		CarRepository,
	],
})
export class CronModule {}
