import { relations } from "drizzle-orm";
import { deliveryRequest } from "./deliveryRequest";
import { rating } from "./rating";
import { reward } from "./reward";
import { travelPlan } from "./travelPlan";
import { user } from "./user";

export const userRelations = relations(user, ({ many }) => ({
	deliveryRequests: many(deliveryRequest, { relationName: "sender" }),
	travelPlans: many(travelPlan),
	ratingsGiven: many(rating, { relationName: "reviewer" }),
	ratingsReceived: many(rating, { relationName: "reviewed" }),
	rewards: many(reward),
}));

export const deliveryRequestRelations = relations(
	deliveryRequest,
	({ one }) => ({
		sender: one(user, {
			fields: [deliveryRequest.senderId],
			references: [user.id],
			relationName: "sender",
		}),
		traveler: one(user, {
			fields: [deliveryRequest.travelerId],
			references: [user.id],
			relationName: "traveler",
		}),
	}),
);
export const travelPlanRelations = relations(travelPlan, ({ one }) => ({
	traveler: one(user, {
		fields: [travelPlan.travelerId],
		references: [user.id],
	}),
}));

export const ratingRelations = relations(rating, ({ one }) => ({
	reviewer: one(user, {
		fields: [rating.reviewerId],
		references: [user.id],
		relationName: "reviewer",
	}),
	reviewed: one(user, {
		fields: [rating.reviewedId],
		references: [user.id],
		relationName: "reviewed",
	}),
	delivery: one(deliveryRequest, {
		fields: [rating.deliveryId],
		references: [deliveryRequest.id],
	}),
}));
