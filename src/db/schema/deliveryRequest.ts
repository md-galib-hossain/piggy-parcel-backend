import { pgTable } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { serial } from "drizzle-orm/pg-core";
import { user } from "./user";
import { boolean } from "drizzle-orm/pg-core";
import { jsonb } from "drizzle-orm/pg-core";
import { decimal } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";

export const deliveryRequest = pgTable("delivery_request", {
  id: serial("id").primaryKey(),
  senderId: text("sender_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  travelerId: text("traveler_id").references(() => user.id, { onDelete: "set null" }),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  parcelDetails: jsonb("parcel_details").notNull(), // { size, weight, contents }
  urgency: boolean("urgency").default(false),
  proposedFee: decimal("proposed_fee", { precision: 10, scale: 2 }),
  status: text("status").notNull().default("pending"), // pending, accepted, picked_up, delivered, cancelled
  pickupPoint: text("pickup_point"),
  dropOffPoint: text("drop_off_point"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),
  trackingId: text("tracking_id").unique(), // For QR code or tracking
});