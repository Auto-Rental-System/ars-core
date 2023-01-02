import { Module } from '@nestjs/common';

import { CarController } from 'controller';
import { CarService, CarFormatter } from 'service/car';
import { CarRepository, RentalOrderRepository } from 'repository';
import { AuthModule } from './auth.module';

@Module({
	imports: [AuthModule],
	controllers: [CarController],
	providers: [CarService, CarFormatter, CarRepository, RentalOrderRepository],
})
export class CarModule {}
