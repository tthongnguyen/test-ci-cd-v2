import * as store from '../../../src/store';
import { withSentry } from '@sentry/nextjs';
import '../../../src/sentry';

function handler(req, res) {
  const { method, query } = req;
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
  try {
    const q = query.q || '';
    const items = store.searchItems(q);
    return res.status(200).json({ items });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Bad Request' });
  }
}

export default withSentry(handler);
