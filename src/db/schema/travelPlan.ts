import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const travelPlan = pgTable("travel_plan", {
	id: serial("id").primaryKey(),
	travelerId: text("traveler_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	origin: text("origin").notNull(),
	destination: text("destination").notNull(),
	departureTime: timestamp("departure_time").notNull(),
	transportMode: text("transport_mode").notNull(), // bus, car, train, etc.
	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.notNull(),
});
