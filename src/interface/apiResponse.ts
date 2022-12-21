import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
	@ApiProperty()
	id: number;
}
