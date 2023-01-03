import { applyDecorators } from '@nestjs/common';
import { ApiProperty as SwaggerApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export function ApiProperty(options?: ApiPropertyOptions) {
	return applyDecorators(
		SwaggerApiProperty(options),
		IsNotEmpty(),
	)
}
