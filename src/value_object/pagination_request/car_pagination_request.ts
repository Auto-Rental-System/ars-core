import { PaginationRequest } from './pagination_request';
import { CarOrderBy } from 'interface/apiRequest';

export enum CarFilterColumns {
	Id = 'car.id',
}

export class CarPaginationRequest extends PaginationRequest<CarOrderBy> {
	protected get columnsToFilter() {
		return Object.values(CarFilterColumns);
	}
}
