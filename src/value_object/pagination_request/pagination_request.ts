import { ApplicationError } from 'shared/error';
import { Order } from 'interface/apiRequest';
import { HttpStatus } from '@nestjs/common';

export interface Filter<T> {
	key: T;
	value: string;
}

export abstract class PaginationRequest<T> {
	static MAX_ROWS_PER_PAGE = 50;

	public readonly filters: Array<Filter<string>> = [];

	// Example: ['entity.name', 'entity.city']
	protected abstract get columnsToFilter(): Array<string>;

	constructor(
		public readonly page: number,
		public readonly rowsPerPage: number,
		// Example: ['a=10', 'b=20', 'c=30']
		enteredFilters: Array<string> = [],
		public readonly order: Order = Order.Desc,
		public readonly orderBy?: T,
	) {
		if (rowsPerPage > PaginationRequest.MAX_ROWS_PER_PAGE) {
			throw new MaxRowsPerPageError();
		}

		if (page < 1) {
			throw new WrongPageNumberError();
		}

		const filters = enteredFilters.map(filter => {
			const [key, value] = filter.split('=');
			return { key, value };
		});
		this.validateFilters(filters);
		this.filters = filters;
	}

	private validateFilters(filters: Array<Filter<string>>): void {
		filters.forEach(filter => {
			if (!this.columnsToFilter.includes(filter.key)) {
				throw new InvalidFiltersError('Invalid filters', HttpStatus.BAD_REQUEST, {
					columnsToFilter: this.columnsToFilter,
				});
			}
		});
	}
}

export class MaxRowsPerPageError extends ApplicationError {}
export class WrongPageNumberError extends ApplicationError {}
export class InvalidFiltersError extends ApplicationError {}
