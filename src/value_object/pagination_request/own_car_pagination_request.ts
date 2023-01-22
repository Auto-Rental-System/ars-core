import { PaginationRequest } from './pagination_request';
import { OwnCarOrderBy } from 'interface/apiRequest';

export enum OwnCarFilterColumns {}

export class OwnCarPaginationRequest extends PaginationRequest<OwnCarOrderBy> {
	protected get columnsToFilter() {
		return Object.values(OwnCarFilterColumns);
	}
}
