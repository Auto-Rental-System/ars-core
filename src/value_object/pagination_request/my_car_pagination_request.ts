import { PaginationRequest } from './pagination_request';
import { MyCarListOrderBy } from 'interface/apiRequest';

export enum OwnCarFilterColumns {}

export class MyCarPaginationRequest extends PaginationRequest<MyCarListOrderBy> {
	protected get columnsToFilter() {
		return Object.values(OwnCarFilterColumns);
	}
}
