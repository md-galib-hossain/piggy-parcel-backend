import { text } from "drizzle-orm/pg-core";
import { integer } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { user } from "./user";
import { timestamp } from "drizzle-orm/pg-core";

export const reward = pgTable("reward", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  greenPoints: integer("green_points").default(0),
  badges: text("badges").$defaultFn(() => ""), // Change to text field, use JSON string if needed
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
});