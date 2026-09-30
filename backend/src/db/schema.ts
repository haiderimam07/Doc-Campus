import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  primaryKey,
  pgEnum,
  index,
  check,
  integer,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Always store timestamps with timezone.
const tstz = (name: string) => timestamp(name, { withTimezone: true });

// ─── Enums ──────────────────────────────────────────────────────────────
export const ocrStatusEnum = pgEnum('ocr_status', ['pending', 'processing', 'done', 'failed']);
export const fileTypeEnum = pgEnum('file_type', ['pdf', 'image', 'doc', 'link', 'other']);

// ─── 1. Users ───────────────────────────────────────────────────────────
export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    username: varchar('username', { length: 30 }).notNull().unique(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    bio: varchar('bio', { length: 280 }),
    avatarUrl: text('avatar_url'),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (table) => ({
    usernameIdx: index('users_username_idx').on(table.username),
  })
);

// ─── 2. Posts (with denormalized counters) ──────────────────────────────
export const posts = pgTable(
  'posts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    description: varchar('description', { length: 2000 }),
    fileUrl: text('file_url').notNull(),
    fileType: fileTypeEnum('file_type').notNull(),
    ocrStatus: ocrStatusEnum('ocr_status').notNull().default('pending'),
    ocrText: text('ocr_text'),
    // Counters: updated in the same transaction as the row they count.
    likeCount: integer('like_count').notNull().default(0),
    commentCount: integer('comment_count').notNull().default(0), // top-level + replies, excluding deleted
    saveCount: integer('save_count').notNull().default(0),
    shareCount: integer('share_count').notNull().default(0),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index('posts_user_id_idx').on(table.userId),
    createdAtIdx: index('posts_created_at_idx').on(table.createdAt.desc()),
    likeCountNonNeg: check('posts_like_count_nonneg', sql`${table.likeCount} >= 0`),
    commentCountNonNeg: check('posts_comment_count_nonneg', sql`${table.commentCount} >= 0`),
    saveCountNonNeg: check('posts_save_count_nonneg', sql`${table.saveCount} >= 0`),
    shareCountNonNeg: check('posts_share_count_nonneg', sql`${table.shareCount} >= 0`),
  })
);

// ─── 3. Tags ────────────────────────────────────────────────────────────
export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 60 }).notNull().unique(),
});

// ─── 4. Post-Tags junction ──────────────────────────────────────────────
export const postTags = pgTable(
  'post_tags',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
    tagIdIdx: index('post_tags_tag_id_idx').on(table.tagId),
  })
);

// ─── 5. Follows ─────────────────────────────────────────────────────────
export const follows = pgTable(
  'follows',
  {
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    followingId: uuid('following_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.followerId, table.followingId] }),
    followerIdIdx: index('follows_follower_id_idx').on(table.followerId),
    followingFollowerIdx: index('follows_following_follower_idx').on(table.followingId, table.followerId),
    followingIdx: index('follows_following_id_idx').on(table.followingId),
    preventSelfFollow: check('prevent_self_follow', sql`${table.followerId} <> ${table.followingId}`),
  })
);

// ─── 6. Comments (one level of replies, soft delete for threads) ────────
export const comments = pgTable(
  'comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    // NULL = top-level comment, otherwise a reply to a top-level comment.
    parentId: uuid('parent_id').references((): AnyPgColumn => comments.id, { onDelete: 'cascade' }),
    body: varchar('body', { length: 1000 }).notNull(),
    likeCount: integer('like_count').notNull().default(0),
    replyCount: integer('reply_count').notNull().default(0), // only meaningful on top-level rows
    createdAt: tstz('created_at').notNull().defaultNow(),
    updatedAt: tstz('updated_at'), // set on edit
    deletedAt: tstz('deleted_at'), // tombstone for top-level comments that still have replies
  },
  (table) => ({
    // Top-level comments of a post, newest first (keyset pagination)
    postCreatedIdx: index('comments_post_created_idx').on(
      table.postId,
      table.createdAt.desc(),
      table.id.desc()
    ),
    // Replies of a comment, oldest first (keyset pagination)
    parentCreatedIdx: index('comments_parent_created_idx').on(table.parentId, table.createdAt, table.id),
    userIdIdx: index('comments_user_id_idx').on(table.userId),
    likeCountNonNeg: check('comments_like_count_nonneg', sql`${table.likeCount} >= 0`),
    replyCountNonNeg: check('comments_reply_count_nonneg', sql`${table.replyCount} >= 0`),
  })
);

// ─── 7. Post likes ──────────────────────────────────────────────────────
export const likes = pgTable(
  'likes',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.userId] }),
    userIdIdx: index('likes_user_id_idx').on(table.userId),
    // "Who liked this post", newest first
    postCreatedIdx: index('likes_post_created_idx').on(table.postId, table.createdAt.desc(), table.userId.desc()),
  })
);

// ─── 8. Comment likes ───────────────────────────────────────────────────
export const commentLikes = pgTable(
  'comment_likes',
  {
    commentId: uuid('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.commentId, table.userId] }),
    userIdIdx: index('comment_likes_user_id_idx').on(table.userId),
  })
);

// ─── 9. Saves ───────────────────────────────────────────────────────────
export const saves = pgTable(
  'saves',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.userId] }),
    // "My saved posts", newest first
    userCreatedIdx: index('saves_user_created_idx').on(table.userId, table.createdAt.desc(), table.postId.desc()),
  })
);

// ─── 10. Shares (event log; same user can share repeatedly) ─────────────
export const shares = pgTable(
  'shares',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    postId: uuid('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: tstz('created_at').notNull().defaultNow(),
  },
  (table) => ({
    postIdIdx: index('shares_post_id_idx').on(table.postId),
  })
);

// ─── Relations ──────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  likes: many(likes),
  commentLikes: many(commentLikes),
  saves: many(saves),
  shares: many(shares),
  followers: many(follows, { relationName: 'following' }),
  following: many(follows, { relationName: 'follower' }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.userId], references: [users.id] }),
  comments: many(comments),
  likes: many(likes),
  saves: many(saves),
  shares: many(shares),
  postTags: many(postTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, { fields: [postTags.postId], references: [posts.id] }),
  tag: one(tags, { fields: [postTags.tagId], references: [tags.id] }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  author: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
    relationName: 'comment_replies',
  }),
  replies: many(comments, { relationName: 'comment_replies' }),
  likes: many(commentLikes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  post: one(posts, { fields: [likes.postId], references: [posts.id] }),
  user: one(users, { fields: [likes.userId], references: [users.id] }),
}));

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  comment: one(comments, { fields: [commentLikes.commentId], references: [comments.id] }),
  user: one(users, { fields: [commentLikes.userId], references: [users.id] }),
}));

export const savesRelations = relations(saves, ({ one }) => ({
  post: one(posts, { fields: [saves.postId], references: [posts.id] }),
  user: one(users, { fields: [saves.userId], references: [users.id] }),
}));

export const sharesRelations = relations(shares, ({ one }) => ({
  post: one(posts, { fields: [shares.postId], references: [posts.id] }),
  user: one(users, { fields: [shares.userId], references: [users.id] }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, { fields: [follows.followerId], references: [users.id], relationName: 'follower' }),
  following: one(users, { fields: [follows.followingId], references: [users.id], relationName: 'following' }),
}));
