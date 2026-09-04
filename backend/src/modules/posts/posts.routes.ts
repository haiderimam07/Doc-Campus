import { FastifyInstance } from 'fastify';
import { createPostSchema, postParamsSchema, feedQuerySchema } from './posts.schema.js';
import { uploadToStorage, deleteFromStorage } from '../../lib/upload.js'; // Your storage utility (Cloudinary/S3)
import {
  createPost,
  getPostById,
  getPostsByUsername,
  deletePost,
  getHybridFeed,
} from './posts.service.js';

export default async function postsRoutes(fastify: FastifyInstance) {

  // GET /posts/feed — Unified Hybrid Feed (optional auth, guest fallback)
  fastify.get('/feed', { preHandler: [fastify.tryAuthenticate] }, async (request, reply) => {
    const { cursor, limit } = feedQuerySchema.parse(request.query);
    const currentUserId = request.user?.sub ?? null;
    const feed = await getHybridFeed(fastify, currentUserId, { cursor, limit });
    return feed;
  });

  // POST /posts — Create Post (Multipart File Upload + Description)
  fastify.post('/', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: 'A file attachment is required' });
    }

    const descriptionField = data.fields.description;
    const { description } = createPostSchema.pick({ description: true }).parse({
      description: descriptionField && 'value' in descriptionField ? descriptionField.value : undefined,
    });

    const { fileUrl, fileType } = await uploadToStorage(data);

    try {
      const post = await createPost(fastify, request.user.sub, { description, fileUrl, fileType });

      // 3. Enqueue BullMQ OCR processing job
      // await fastify.ocrQueue.add('process-ocr', { postId: post.id, fileUrl: post.fileUrl });

      return reply.status(201).send(post);
    } catch (err) {
      await deleteFromStorage(fileUrl).catch(() => {});
      throw err;
    }
  });

  // GET /posts/user/:username — User Profile Posts (cursor-paginated, same shape as /feed)
  fastify.get('/user/:username', async (request, reply) => {
    const { username } = request.params as { username: string };
    const { cursor, limit } = feedQuerySchema.parse(request.query);

    const userPosts = await getPostsByUsername(fastify, username, { cursor, limit});

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