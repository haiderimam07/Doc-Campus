ALTER TYPE "public"."file_type" ADD VALUE IF NOT EXISTS 'link' BEFORE 'other';--> statement-breakpoint
ALTER TABLE "likes" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "saves" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "follows_follower_id_idx" ON "follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "follows_following_follower_idx" ON "follows" USING btree ("following_id","follower_id");