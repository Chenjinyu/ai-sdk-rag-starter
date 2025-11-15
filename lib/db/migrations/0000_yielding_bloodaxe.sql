CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "resources" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "embeddings" (
	"id" SERIAL PRIMARY KEY NOT NULL,
	"resource_id" varchar(191) REFERENCES "resources"("id") ON DELETE CASCADE,
	"embedding" vector(1536) NOT NULL
);