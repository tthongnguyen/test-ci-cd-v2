import * as store from '../../../src/store';
import { withSentry as withSentryMaybe } from '@sentry/nextjs';
import '../../../src/sentry';

const withSentry = typeof withSentryMaybe === 'function' ? withSentryMaybe : (h) => h;

function handler(req, res) {
  const { method, query } = req;

  try {
    if (method === 'GET') {
      const items = store.listItems();
      const hasPagination = Object.prototype.hasOwnProperty.call(query, 'limit') ||
        Object.prototype.hasOwnProperty.call(query, 'offset');
      if (!hasPagination) {
        return res.status(200).json({ items });
      }

      const limitRaw = query.limit;
      const offsetRaw = query.offset;
      let limit = Number(limitRaw);
      let offset = Number(offsetRaw);
      if (!Number.isFinite(limit) || limit <= 0) limit = 50;
      if (limit > 100) limit = 100;
      if (!Number.isFinite(offset) || offset < 0) offset = 0;

      const total = items.length;
      const sliced = items.slice(offset, offset + limit);
      return res.status(200).json({ items: sliced, meta: { total, limit, offset } });
    }

    if (method === 'POST') {
      const item = store.createItem(req.body || {});
      return res.status(201).json({ item });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Bad Request' });
  }
}

export default withSentry(handler);
