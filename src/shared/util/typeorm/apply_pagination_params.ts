import { SelectQueryBuilder } from 'typeorm';
import { PaginationRequest } from 'value_object/pagination_request';

export function applyPaginationParams<T>(
	query: SelectQueryBuilder<T>,
	paginationRequest: PaginationRequest<any>,
): SelectQueryBuilder<T> {
	if (paginationRequest.orderBy) {
		query = query.orderBy(paginationRequest.orderBy, paginationRequest.order);
	}

	return query
		.limit(paginationRequest.rowsPerPage)
		.offset((paginationRequest.page - 1) * paginationRequest.rowsPerPage);
}
