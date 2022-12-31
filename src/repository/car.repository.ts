import { EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CarRepository {
	constructor(private manager: EntityManager) {}
}
