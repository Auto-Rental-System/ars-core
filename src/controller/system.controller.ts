import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { DevInfoResponse } from 'interface/apiResponse';

@Controller('system')
@ApiTags('System')
export class SystemController {
	@Get('/healthy')
	@ApiResponse({ status: HttpStatus.OK })
	public async healthy(@Res() res: FastifyReply): Promise<void> {
		res.status(HttpStatus.OK).send();
	}

	// we need it because nest swagger doesn't export some necessary info
	@Get('/dev/info')
	@ApiResponse({ status: HttpStatus.OK, type: DevInfoResponse })
	public async getDevInfo(): Promise<DevInfoResponse> {
		return {};
	}
}
