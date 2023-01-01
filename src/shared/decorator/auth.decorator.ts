import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthenticationGuard, RolesGuard } from 'guard';
import { Roles } from 'shared/decorator';
import { UserRole } from 'entity/user.entity';

export function Auth(...roles: UserRole[]) {
	return applyDecorators(
		Roles(...roles),
		UseGuards(AuthenticationGuard, RolesGuard),
		ApiBearerAuth('authorization'),
		ApiUnauthorizedResponse({ description: 'Unauthorized' }),
	);
}
