CREATE INDEX "follows_follower_id_idx" ON "follows" USING btree ("follower_id");--> statement-breakpoint
CREATE INDEX "follows_following_follower_idx" ON "follows" USING btree ("following_id","follower_id");
