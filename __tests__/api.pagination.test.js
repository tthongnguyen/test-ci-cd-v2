const handlerList = require('../pages/api/items/index').default || require('../pages/api/items/index');
const handlerSearch = require('../pages/api/items/search').default || require('../pages/api/items/search');

function mockReqRes({ method = 'GET', body = null, query = {} } = {}) {
  const req = { method, body, query };
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) { this.statusCode = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(payload) { this.body = payload; return this; },
    end() { return this; },
  };
  return { req, res };
}

describe('API pagination (limit/offset)', () => {
  test('GET /api/items with limit/offset returns meta and sliced items', async () => {
    // seed: create 5 items
    for (let i = 1; i <= 5; i++) {
      const c = mockReqRes({ method: 'POST', body: { name: `Item ${i}` } });
      await handlerList(c.req, c.res);
    }

    const r = mockReqRes({ method: 'GET', query: { limit: '2', offset: '1' } });
    await handlerList(r.req, r.res);
    expect(r.res.statusCode).toBe(200);
    expect(r.res.body.meta).toEqual({ total: 5, limit: 2, offset: 1 });
    expect(r.res.body.items.map(i => i.name)).toEqual(['Item 2', 'Item 3']);
  });

  test('GET /api/items/search with limit/offset returns meta and sliced items', async () => {
    // seed
    for (const name of ['Alpha', 'alphabet', 'Beta', 'alpine']) {
      const c = mockReqRes({ method: 'POST', body: { name } });
      await handlerList(c.req, c.res);
    }

    const r = mockReqRes({ method: 'GET', query: { q: 'alp', limit: '1', offset: '1' } });
    await handlerSearch(r.req, r.res);
    expect(r.res.statusCode).toBe(200);
    expect(r.res.body.meta).toEqual({ total: 3, limit: 1, offset: 1 });
    expect(r.res.body.items.map(i => i.name)).toEqual(['alphabet']);
  });
});

