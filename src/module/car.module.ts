import { Module } from '@nestjs/common';

import { CarController } from 'controller';
import { CarService, CarFormatter } from 'service/car';
import { RentalService } from 'service/rental';
import { StorageService } from 'service/storage';
import { PaypalService, PaypalClient } from 'service/paypal';
import { PaymentService } from 'service/payment';
import { CarImageRepository, CarRepository, RentalOrderRepository, PaymentRepository } from 'repository';
import { AuthModule } from './auth.module';

@Module({
	imports: [AuthModule],
	controllers: [CarController],
	providers: [
		CarService,
		RentalService,
		CarFormatter,
		CarRepository,
		RentalOrderRepository,
		StorageService,
		CarImageRepository,
		PaypalService,
		PaypalClient,
		PaymentRepository,
		PaymentService,
	],
})
export class CarModule {}
