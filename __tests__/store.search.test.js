const store = require("../src/store");

describe("store.searchItems", () => {
	beforeEach(() => store.resetStore());

	test("returns empty array for empty query", () => {
		store.createItem({ name: "Alpha" });
		expect(store.searchItems("")).toEqual([]);
	});

	test("finds items case-insensitively", () => {
		store.createItem({ name: "Alpha" });
		store.createItem({ name: "Beta" });
		store.createItem({ name: "alphabet" });
		expect(store.searchItems("alp").map((i) => i.name)).toEqual([
			"Alpha",
			"alphabet",
		]);
		expect(store.searchItems("BETA").map((i) => i.name)).toEqual(["Beta"]);
	});
});
