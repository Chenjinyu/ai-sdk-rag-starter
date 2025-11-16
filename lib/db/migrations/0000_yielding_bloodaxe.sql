CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS "resources" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

DROP TABLE IF EXISTS "embeddings";
CREATE TABLE IF NOT EXISTS "embeddings" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"resource_id" varchar(191) REFERENCES "resources"("id") ON DELETE CASCADE,
	"content" text NOT NULL,
	"embedding" vector(1536) NOT NULL
);

-- delete all records for both tables
TRUNCATE TABLE embeddings, resources RESTART IDENTITY CASCADE;