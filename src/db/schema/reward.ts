import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";

export const reward = pgTable("reward", {
	id: serial("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	greenPoints: integer("green_points").default(0),
	badges: text("badges").$defaultFn(() => ""), // Change to text field, use JSON string if needed
	createdAt: timestamp("created_at")
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => new Date())
		.notNull(),
});
