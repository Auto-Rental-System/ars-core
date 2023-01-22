import { PaginationRequest } from './pagination_request';
import { CarOrderBy } from 'interface/apiRequest';

export enum CarFilterColumns {}

export class CarPaginationRequest extends PaginationRequest<CarOrderBy> {
	protected get columnsToFilter() {
		return Object.values(CarFilterColumns);
	}
}
