const handlerList =
	require("../pages/api/items/index").default ||
	require("../pages/api/items/index");
const handlerItem =
	require("../pages/api/items/[id]").default ||
	require("../pages/api/items/[id]");
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

describe("API 405 paths", () => {
	test("items index: 405 for unsupported method", async () => {
		const ctx = mockReqRes({ method: "PUT" });
		await handlerList(ctx.req, ctx.res);
		expect(ctx.res.statusCode).toBe(405);
		expect(ctx.res.headers.Allow).toEqual(["GET", "POST"]);
		expect(ctx.res.body).toEqual({ error: "Method PUT Not Allowed" });
	});

	test("item by id: 405 for unsupported method", async () => {
		const ctx = mockReqRes({ method: "POST", query: { id: 1 } });
		await handlerItem(ctx.req, ctx.res);
		expect(ctx.res.statusCode).toBe(405);
		expect(ctx.res.headers.Allow).toEqual(["GET", "PUT", "PATCH", "DELETE"]);
		expect(ctx.res.body).toEqual({ error: "Method POST Not Allowed" });
	});

	test("search: 405 for unsupported method", async () => {
		const ctx = mockReqRes({ method: "POST", query: { q: "x" } });
		await handlerSearch(ctx.req, ctx.res);
		expect(ctx.res.statusCode).toBe(405);
		expect(ctx.res.headers.Allow).toEqual(["GET"]);
		expect(ctx.res.body).toEqual({ error: "Method POST Not Allowed" });
	});
});
