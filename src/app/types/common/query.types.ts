export type SortOrder = "asc" | "desc";

export type TPaginationOptions = {
	limit?: number;
	cursor?: string;
};

export type BaseQueryParams = {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: SortOrder;
};

export type SearchQueryParams = BaseQueryParams & {
	search?: string;
};

export type DateRangeQueryParams = {
	dateFrom?: Date;
	dateTo?: Date;
};

export type SortParams<T> = { [K in keyof T]?: SortOrder };

export type FilterParams<T> = {
	[K in keyof T]?: T[K] extends string
		? string | string[]
		: T[K] extends number
			? number | { min?: number; max?: number }
			: T[K] extends Date
				? Date | { from?: Date; to?: Date }
				: T[K] extends boolean
					? boolean
					: T[K];
};

export type QueryParams<T> = {
	search?: string;
	page?: number;
	limit?: number;
	sort?: SortParams<T>;
	filters?: FilterParams<Partial<T>>;
};
