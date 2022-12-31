import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'entity/user.entity';

export const METADATA_ROLE_KEY = 'roles';

export const Roles = (...roles: UserRole[]) => SetMetadata(METADATA_ROLE_KEY, roles);
