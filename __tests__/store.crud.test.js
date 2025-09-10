const store = require("../src/store");

describe("store CRUD", () => {
	beforeEach(() => store.resetStore());

	test("create and list items", () => {
		const a = store.createItem({ name: "A" });
		const b = store.createItem({ name: "B" });
		expect(a.id).toBe(1);
		expect(b.id).toBe(2);
		expect(store.listItems().map((i) => i.name)).toEqual(["A", "B"]);
	});

	test("get item by id", () => {
		const a = store.createItem({ name: "A" });
		expect(store.getItem(a.id)).toMatchObject({ id: a.id, name: "A" });
		expect(store.getItem(999)).toBeNull();
	});

	test("update item", () => {
		const a = store.createItem({ name: "A" });
		const updated = store.updateItem(a.id, { name: "A1" });
		expect(updated).toMatchObject({ id: a.id, name: "A1" });
	});

	test("delete item", () => {
		const a = store.createItem({ name: "A" });
		expect(store.deleteItem(a.id)).toBe(true);
		expect(store.getItem(a.id)).toBeNull();
		expect(store.deleteItem(a.id)).toBe(false);
	});
});
