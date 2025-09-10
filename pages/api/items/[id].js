import * as store from '../../../src/store';
import { withSentry } from '@sentry/nextjs';
import '../../../src/sentry';

function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  try {
    if (method === 'GET') {
      const item = store.getItem(id);
      if (!item) return res.status(404).json({ error: 'Not Found' });
      return res.status(200).json({ item });
    }

    if (method === 'PUT' || method === 'PATCH') {
      const updated = store.updateItem(id, req.body || {});
      if (!updated) return res.status(404).json({ error: 'Not Found' });
      return res.status(200).json({ item: updated });
    }

    if (method === 'DELETE') {
      const ok = store.deleteItem(id);
      if (!ok) return res.status(404).json({ error: 'Not Found' });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Bad Request' });
  }
}

export default withSentry(handler);
