CREATE TABLE "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"website" text NOT NULL,
	"description" text NOT NULL,
	"industry" text NOT NULL,
	"stage" text NOT NULL,
	"location" text NOT NULL,
	"logo_url" text NOT NULL,
	"funding" text NOT NULL,
	"founded" integer NOT NULL,
	"signal_score" integer NOT NULL,
	"founders" jsonb,
	"investors" jsonb,
	"tags" jsonb,
	"funding_rounds" jsonb,
	"headcount" integer,
	"headcount_growth" integer,
	"social_links" jsonb,
	"signals" jsonb,
	"user_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"investment_thesis" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
