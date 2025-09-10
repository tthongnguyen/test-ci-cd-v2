const handlerList = require('../pages/api/items/index').default || require('../pages/api/items/index');
const handlerItem = require('../pages/api/items/[id]').default || require('../pages/api/items/[id]');
const handlerSearch = require('../pages/api/items/search').default || require('../pages/api/items/search');
const store = require('../src/store');

function mockReqRes({ method = 'GET', body = null, query = {} } = {}) {
  const req = { method, body, query };
  const res = {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    setHeader(name, value) {
      this.headers[name] = value;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
  return { req, res };
}

describe('API /api/items CRUD', () => {
  beforeEach(() => store.resetStore());

  test('GET empty list', async () => {
    const { req, res } = mockReqRes({ method: 'GET' });
    await handlerList(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [] });
  });

  test('POST create then GET list', async () => {
    const c = mockReqRes({ method: 'POST', body: { name: 'Item1' } });
    await handlerList(c.req, c.res);
    expect(c.res.statusCode).toBe(201);
    expect(c.res.body.item).toMatchObject({ id: 1, name: 'Item1' });

    const g = mockReqRes({ method: 'GET' });
    await handlerList(g.req, g.res);
    expect(g.res.statusCode).toBe(200);
    expect(g.res.body.items.length).toBe(1);
  });

  test('GET/PUT/DELETE single item', async () => {
    // create
    const c = mockReqRes({ method: 'POST', body: { name: 'X' } });
    await handlerList(c.req, c.res);

    // get
    const g = mockReqRes({ method: 'GET', query: { id: 1 } });
    await handlerItem(g.req, g.res);
    expect(g.res.statusCode).toBe(200);
    expect(g.res.body.item).toMatchObject({ id: 1, name: 'X' });

    // update
    const u = mockReqRes({ method: 'PUT', query: { id: 1 }, body: { name: 'Y' } });
    await handlerItem(u.req, u.res);
    expect(u.res.statusCode).toBe(200);
    expect(u.res.body.item).toMatchObject({ id: 1, name: 'Y' });

    // delete
    const d = mockReqRes({ method: 'DELETE', query: { id: 1 } });
    await handlerItem(d.req, d.res);
    expect(d.res.statusCode).toBe(204);

    // get after delete
    const g2 = mockReqRes({ method: 'GET', query: { id: 1 } });
    await handlerItem(g2.req, g2.res);
    expect(g2.res.statusCode).toBe(404);
  });

  test('SEARCH items by q', async () => {
    // create data
    await handlerList(...Object.values(mockReqRes({ method: 'POST', body: { name: 'Alpha' } })));
    await handlerList(...Object.values(mockReqRes({ method: 'POST', body: { name: 'Beta' } })));
    await handlerList(...Object.values(mockReqRes({ method: 'POST', body: { name: 'alphabet' } })));

    const s1 = mockReqRes({ method: 'GET', query: { q: 'alp' } });
    await handlerSearch(s1.req, s1.res);
    expect(s1.res.statusCode).toBe(200);
    expect(s1.res.body.items.map(i => i.name)).toEqual(['Alpha', 'alphabet']);

    const s2 = mockReqRes({ method: 'GET', query: { q: '' } });
    await handlerSearch(s2.req, s2.res);
    expect(s2.res.statusCode).toBe(200);
    expect(s2.res.body.items).toEqual([]);
  });
});
