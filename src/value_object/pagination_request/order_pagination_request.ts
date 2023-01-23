import { PaginationRequest } from './pagination_request';
import { OrderListOrderBy } from 'interface/apiRequest';

export enum OrderFilterColumns {}

export class OrderPaginationRequest extends PaginationRequest<OrderListOrderBy> {
	protected get columnsToFilter() {
		return Object.values(OrderFilterColumns);
	}
}
