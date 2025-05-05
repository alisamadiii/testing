import { relations } from "drizzle-orm";
import {
  user,
  session,
  account,
  verification,
  webhookEvents,
  plans,
  orders,
  team,
  analytics,
} from "./schema";

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  teams: many(team),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const teamRelations = relations(team, ({ one }) => ({
  owner: one(user, {
    fields: [team.ownerId],
    references: [user.id],
  }),
}));

export const orderRelations = relations(orders, ({ one }) => ({
  plan: one(plans, {
    fields: [orders.variantId],
    references: [plans.variantId],
  }),
}));
