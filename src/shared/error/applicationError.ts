import { HttpStatus } from '@nestjs/common';

export class ApplicationError {
	public id: string;
	public readonly statusCode: number;
	public readonly data?: any;
	public readonly message: string;

	constructor(message?: string, statusCode = HttpStatus.BAD_REQUEST, data?: any) {
		this.id = this.constructor.name;
		this.message = message || this.id;
		this.statusCode = statusCode;
		this.data = data;
	}
}
