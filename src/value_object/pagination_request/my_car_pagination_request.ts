import { PaginationRequest } from './pagination_request';
import { MyCarListOrderBy } from 'interface/apiRequest';

export enum MyCarListFilterColumns {}

export class MyCarPaginationRequest extends PaginationRequest<MyCarListOrderBy> {
	protected get columnsToFilter() {
		return Object.values(MyCarListFilterColumns);
	}
}
