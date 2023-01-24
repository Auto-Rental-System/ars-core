import { PaginationRequest } from './pagination_request';
import { OwnCarListOrderBy } from 'interface/apiRequest';

export enum OwnCarFilterColumns {}

export class OwnCarPaginationRequest extends PaginationRequest<OwnCarListOrderBy> {
	protected get columnsToFilter() {
		return Object.values(OwnCarFilterColumns);
	}
}
