import { EventEmitter } from 'node:events';

// Domain events. Services emit AFTER their transaction commits; a notifications
// worker (e.g. a BullMQ producer) can subscribe later without touching the services.
export interface AppEvents {
  'post.liked': { postId: string; actorId: string; postOwnerId: string };
  'post.shared': { postId: string; actorId: string; postOwnerId: string };
  'comment.created': {
    commentId: string;
    postId: string;
    actorId: string;
    postOwnerId: string;
    parentAuthorId: string | null;
  };
  'comment.liked': { commentId: string; postId: string; actorId: string; commentAuthorId: string };
}

class TypedEvents {
  private ee = new EventEmitter();
  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]) {
    this.ee.emit(event, payload);
  }
  on<K extends keyof AppEvents>(event: K, handler: (payload: AppEvents[K]) => void) {
    this.ee.on(event, handler);
  }
}

export const events = new TypedEvents();
