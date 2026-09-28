import { FastifyInstance } from 'fastify';
import {
  createPostSchema,
  createLinkPostSchema,
  postParamsSchema,
  feedQuerySchema,
} from './posts.schema.js';
import { uploadToStorage, deleteFromStorage } from '../../lib/upload.js'; // Your storage utility (Cloudinary/S3)
import {
  createPost,
  getPostById,
  getPostsByUsername,
  deletePost,
  getHybridFeed,
  savePost,
  unsavePost,
  getSavedPostIds,
} from './posts.service.js';

export default async function postsRoutes(fastify: FastifyInstance) {

  fastify.get('/saved', { preHandler: [fastify.authenticate] }, async (request) => {
    return getSavedPostIds(fastify, request.user.sub);
  });

  // GET /posts/feed — Unified Hybrid Feed (optional auth, guest fallback)
  fastify.get('/feed', { preHandler: [fastify.tryAuthenticate] }, async (request, reply) => {
    const { cursor, limit } = feedQuerySchema.parse(request.query);
    const currentUserId = request.user?.sub ?? null;
    const feed = await getHybridFeed(fastify, currentUserId, { cursor, limit });
    return feed;
  });

  // POST /posts — Create Post
  //   • multipart  → file upload + optional description
  //   • JSON       → website link + optional description
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    // ---- Link post (JSON body) ----
    if (!request.isMultipart()) {
      const { link, description } = createLinkPostSchema.parse(request.body);

      const post = await createPost(fastify, request.user.sub, {
        description,
        fileUrl: link,
        fileType: 'link',
      });

      return reply.status(201).send(post);
    }

    // ---- File post (multipart) ----
    // FIX: read fields and file via request.parts() so the description is captured
    // regardless of whether the client sends it before or after the file.
    let rawDescription: string | undefined;
    let uploaded: Awaited<ReturnType<typeof uploadToStorage>> | undefined;

    try {
      for await (const part of request.parts()) {
        if (part.type === 'field') {
          if (part.fieldname === 'description') {
            rawDescription = String(part.value);
          }
        } else if (part.type === 'file') {
          if (uploaded) {
            // ignore any extra files, but drain the stream so parsing continues
            part.file.resume();
            continue;
          }
          uploaded = await uploadToStorage(part);
        }
      }

      if (!uploaded) {
        return reply.status(400).send({ error: 'A file attachment is required' });
      }

      const { description } = createPostSchema
        .pick({ description: true })
        .parse({ description: rawDescription });

      const post = await createPost(fastify, request.user.sub, {
        description,
        fileUrl: uploaded.fileUrl,
        fileType: uploaded.fileType,
      });

      // 3. Enqueue BullMQ OCR processing job
      // await fastify.ocrQueue.add('process-ocr', { postId: post.id, fileUrl: post.fileUrl });

      return reply.status(201).send(post);
    } catch (err) {
      // clean up the orphaned R2 upload if anything failed after it succeeded
      if (uploaded) {
        await deleteFromStorage(uploaded.fileUrl).catch(() => {});
      }
      throw err;
    }
  });

  fastify.post('/:id/save', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = postParamsSchema.parse(request.params);
    return savePost(fastify, id, request.user.sub);
  });

  fastify.delete('/:id/save', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = postParamsSchema.parse(request.params);
    return unsavePost(fastify, id, request.user.sub);
  });

  // GET /posts/user/:username — User Profile Posts (cursor-paginated, same shape as /feed)
  fastify.get('/user/:username', async (request, reply) => {
    const { username } = request.params as { username: string };
    const { cursor, limit } = feedQuerySchema.parse(request.query);

    const userPosts = await getPostsByUsername(fastify, username, { cursor, limit });

    return userPosts;
  });

  // GET /posts/:id — Fetch Single Post Details
  fastify.get('/:id', async (request, reply) => {
    const { id } = postParamsSchema.parse(request.params);
    const post = await getPostById(fastify, id);

    if (!post) {
      return reply.status(404).send({ error: 'Post not found' });
    }

    return post;
  });

  // DELETE /posts/:id — Delete Post (Author only)
  fastify.delete('/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { id } = postParamsSchema.parse(request.params);
    const userId = request.user.sub;

    const success = await deletePost(fastify, id, userId);

    if (!success) {
      return reply.status(403).send({ error: 'Unauthorized or post not found' });
    }

    return { message: 'Post deleted successfully' };
  });
}