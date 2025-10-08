import { pgTable, serial } from "drizzle-orm/pg-core";
import { user } from "./user";
import { text } from "drizzle-orm/pg-core";
import { deliveryRequest } from "./deliveryRequest";
import { integer } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";

export const rating = pgTable("rating", {
  id: serial("id").primaryKey(),
  reviewerId: text("reviewer_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  reviewedId: text("reviewed_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  deliveryId: serial("delivery_id").references(() => deliveryRequest.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
});