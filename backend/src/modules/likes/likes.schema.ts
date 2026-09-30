import { pageQuery } from '../../lib/common.schema.js';

// "Who liked this" list: small pages, it is a popup, not a feed.
export const listLikersQuery = pageQuery(20, 50);
