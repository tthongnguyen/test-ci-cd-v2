import * as store from '../../../src/store';

export default function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const items = store.listItems();
      return res.status(200).json({ items });
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
