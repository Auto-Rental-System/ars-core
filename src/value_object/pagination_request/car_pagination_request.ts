import { PaginationRequest } from './pagination_request';
import { CarListOrderBy } from 'interface/apiRequest';

export enum CarFilterColumns {}

export class CarPaginationRequest extends PaginationRequest<CarListOrderBy> {
	protected get columnsToFilter() {
		return Object.values(CarFilterColumns);
	}
}
