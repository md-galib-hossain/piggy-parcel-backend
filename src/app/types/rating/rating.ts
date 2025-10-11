import type { CreateInput, UpdateInput } from "../common";
import type { User } from "../user/auth";

export interface Rating {
	id: number;
	reviewerId: string;
	reviewedId: string;
	deliveryId: number;
	rating: number;
	comment?: string | null;
	createdAt: Date;
}

// Using utility types for cleaner interfaces
export type CreateRating = CreateInput<Rating>;
export type UpdateRating = UpdateInput<
	Rating,
	"reviewerId" | "reviewedId" | "deliveryId"
>;

// Using intersection types for extended interfaces
export interface RatingWithUsers extends Rating {
	reviewer: User;
	reviewed: User;
}

// Query parameters
export interface RatingQueryParams {
	reviewerId?: string;
	reviewedId?: string;
	deliveryId?: number;
	rating?: number;
}

// Rating statistics using Record utility type
export interface UserRatingStats {
	userId: string;
	averageRating: number;
	totalRatings: number;
	ratingsBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
}
