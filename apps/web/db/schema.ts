import { sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  serial,
  jsonb,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  seats: integer("seats").default(0),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const webhookEvents = pgTable("webhookEvent", {
  id: integer("id").primaryKey(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  eventName: text("eventName").notNull(),
  processed: boolean("processed").default(false),
  body: jsonb("body").notNull(),
  processingError: text("processingError"),
});

export const plans = pgTable("plan", {
  id: serial("id").primaryKey().notNull(),
  productId: integer("productId").notNull(),
  productName: text("productName"),
  variantId: integer("variantId").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  isUsageBased: boolean("isUsageBased").default(false),
  interval: text("interval"),
  intervalCount: integer("intervalCount"),
  trialInterval: text("trialInterval"),
  trialIntervalCount: integer("trialIntervalCount"),
  sort: integer("sort"),
  thumbnail: text("thumbnail"),
});

export const orders = pgTable("order", {
  id: serial("id").primaryKey(),
  orderId: text("orderId").unique().notNull(),
  refunded: boolean("refunded").default(false),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  status: text("status", {
    enum: [
      "pending",
      "failed",
      "paid",
      "refunded",
      "partial_refund",
      "fraudulent",
    ],
  }).notNull(),
  variantId: integer("variantId")
    .notNull()
    .references(() => plans.variantId),
  productName: text("productName").notNull(),
});

export const team = pgTable(
  "team",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .primaryKey(),
    to: text("to").notNull(),
    ownerId: text("ownerId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
    expiresAt: timestamp("expiresAt", { mode: "date" })
      .notNull()
      .default(sql`now() + interval '7 days'`),
    status: text("status", {
      enum: ["active", "pending", "removed", "declined"],
    }).notNull(),
  },
  (table) => ({
    ownerInviterUnique: uniqueIndex("owner_inviter_unique").on(
      table.ownerId,
      table.to
    ),
  })
);

export const analytics = pgTable("analytics", {
  name: text("name").notNull().primaryKey(),
  clicked: integer("clicked").default(0),
  views: integer("views").default(0),
  updatedAt: timestamp("updatedAt", { mode: "date" }).notNull().defaultNow(),
});

export type User = typeof user.$inferInsert;
export type UserSelect = typeof user.$inferSelect;
export type Session = typeof session.$inferInsert;
export type Account = typeof account.$inferInsert;
export type Verification = typeof verification.$inferInsert;
export type WebhookEvent = typeof webhookEvents.$inferInsert;
export type Plan = typeof plans.$inferInsert;
export type PlanSelect = typeof plans.$inferSelect;
export type Order = typeof orders.$inferInsert;
export type OrderSelect = typeof orders.$inferSelect;
export type Team = typeof team.$inferInsert;
export type TeamSelect = typeof team.$inferSelect;
