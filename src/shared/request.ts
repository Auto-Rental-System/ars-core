import { User } from 'model';
import { FastifyRequest } from 'fastify';

export interface Request extends FastifyRequest {
	user: User;
}
