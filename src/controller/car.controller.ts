import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';

@Controller('cars')
@ApiTags('Car')
export class CarController {
	@Post('add')
	@Auth(UserRole.Renter)
	public async add(): Promise<any> {
		return { status: 'ok' };
	}
}
