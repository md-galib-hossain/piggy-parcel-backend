export interface BaseEntity {
	id: number | string;
	createdAt: Date;
	updatedAt: Date;
}

export interface TimestampFields {
	createdAt: Date;
	updatedAt: Date;
}

export type CreateInput<T, ExcludedKeys extends keyof T = never> = Omit<
	T,
	"id" | "createdAt" | "updatedAt" | ExcludedKeys
>;

export type UpdateInput<T, ExcludedKeys extends keyof T = never> = Partial<
	CreateInput<T, ExcludedKeys>
>;
