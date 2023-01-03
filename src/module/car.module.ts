import { Module } from '@nestjs/common';

import { CarController } from 'controller';
import { CarService, CarRentalService, CarFormatter } from 'service/car';
import { CarImageRepository, CarRepository, RentalOrderRepository } from 'repository';
import { AuthModule } from './auth.module';
import { StorageService } from 'service/storage';

@Module({
	imports: [AuthModule],
	controllers: [CarController],
	providers: [
		CarService,
		CarRentalService,
		CarFormatter,
		CarRepository,
		RentalOrderRepository,
		StorageService,
		CarImageRepository,
	],
})
export class CarModule {}
