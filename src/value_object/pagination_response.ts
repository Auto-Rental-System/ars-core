export class PaginationResponse<T> {
	constructor(
		public readonly page: number,
		public readonly rowsPerPage: number,
		public readonly total: number,
		public readonly list: Array<T>,
	) {}
}
