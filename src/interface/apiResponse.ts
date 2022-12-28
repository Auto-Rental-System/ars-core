import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'entity/user.entity';

export class UserResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	email: string;

	@ApiProperty()
	firstName: string;

	@ApiProperty()
	lastName: string;

	@ApiProperty({ enum: UserRole })
	role: UserRole;
}
