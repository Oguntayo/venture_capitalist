import { pgTable, text, timestamp, uuid, integer, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    investmentThesis: text("investment_thesis"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const lists = pgTable("lists", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: text("name").notNull(),
    companies: jsonb("companies").default('[]').notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const companies = pgTable("companies", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    website: text("website").notNull(),
    description: text("description").notNull(),
    industry: text("industry").notNull(),
    stage: text("stage").notNull(),
    location: text("location").notNull(),
    logoUrl: text("logo_url").notNull(),
    funding: text("funding").notNull(),
    founded: integer("founded").notNull(),
    signalScore: integer("signal_score").notNull(),
    founders: jsonb("founders"),
    investors: jsonb("investors"),
    tags: jsonb("tags"),
    fundingRounds: jsonb("funding_rounds"),
    headcount: integer("headcount"),
    headcountGrowth: integer("headcount_growth"),
    socialLinks: jsonb("social_links"),
    signals: jsonb("signals"),
    userNotes: text("user_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
