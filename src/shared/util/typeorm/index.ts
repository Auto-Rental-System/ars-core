export { applyFilters } from './apply_filters';
export { applyPaginationParams } from './apply_pagination_params';

export interface ListWithTotal<T> {
	list: Array<T>;
	total: number;
}
