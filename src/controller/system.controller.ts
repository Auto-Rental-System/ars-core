import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

@Controller('system')
@ApiTags('System')
export class SystemController {
	@Get('healthy')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({ status: HttpStatus.OK })
	public async healthy(@Res() res: FastifyReply): Promise<void> {
		res.status(HttpStatus.OK).send();
	}
}
