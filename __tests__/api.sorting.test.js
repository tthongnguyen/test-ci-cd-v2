const handlerList =
	require("../pages/api/items/index").default ||
	require("../pages/api/items/index");
const handlerSearch =
	require("../pages/api/items/search").default ||
	require("../pages/api/items/search");

function mockReqRes({ method = "GET", body = null, query = {} } = {}) {
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

describe("API sorting (sort/order)", () => {
	test("list: sort by name asc/desc", async () => {
		for (const name of ["bravo", "alpha", "charlie"]) {
			const c = mockReqRes({ method: "POST", body: { name } });
			await handlerList(c.req, c.res);
		}

		const asc = mockReqRes({
			method: "GET",
			query: { sort: "name", order: "asc" },
		});
		await handlerList(asc.req, asc.res);
		expect(asc.res.statusCode).toBe(200);
		expect(asc.res.body.items.map((i) => i.name)).toEqual([
			"alpha",
			"bravo",
			"charlie",
		]);

		const desc = mockReqRes({
			method: "GET",
			query: { sort: "name", order: "desc" },
		});
		await handlerList(desc.req, desc.res);
		expect(desc.res.statusCode).toBe(200);
		expect(desc.res.body.items.map((i) => i.name)).toEqual([
			"charlie",
			"bravo",
			"alpha",
		]);
	});

	test("search: sort by id desc", async () => {
		for (const name of ["note a", "note b", "another a"]) {
			const c = mockReqRes({ method: "POST", body: { name } });
			await handlerList(c.req, c.res);
		}

		const s = mockReqRes({
			method: "GET",
			query: { q: "a", sort: "id", order: "desc" },
		});
		await handlerSearch(s.req, s.res);
		expect(s.res.statusCode).toBe(200);
		// IDs are incremental; filtered items containing 'a' in that order should be reversed
		expect(s.res.body.items.map((i) => i.id)).toEqual([3, 1]);
	});
});
