export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
	Required<Pick<T, K>>;
export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type ArrayToUnion<T extends ReadonlyArray<any>> = T[number];

export type WithRelations<T, R> = T & R;

export type PaginatedResponse<T> = {
	data: T[];
	meta: {
		page?: number;
		limit?: number;
		total?: number;
		totalPages?: number;
		nextCursor?: string | null;
		hasNextPage?: boolean;
		hasPreviousPage?: boolean;
	};
};
