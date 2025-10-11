import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { deliveryRequest } from "./deliveryRequest";
import { user } from "./user";

export const rating = pgTable("rating", {
	id: serial("id").primaryKey(),
	reviewerId: text("reviewer_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	reviewedId: text("reviewed_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	deliveryId: serial("delivery_id").references(() => deliveryRequest.id, {
		onDelete: "cascade",
	}),
	rating: integer("rating").notNull(), // 1-5
	comment: text("comment"),
	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
});
