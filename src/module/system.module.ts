import { Module } from '@nestjs/common';

import { SystemController } from 'controller';

@Module({
	imports: [],
	controllers: [SystemController],
	providers: [],
})
export class SystemModule {}
