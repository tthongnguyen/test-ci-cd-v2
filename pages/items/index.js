import { useCallback, useEffect, useMemo, useState } from "react";

function Controls({ params, setParams, onReload }) {
	const [name, setName] = useState("");
	const [search, setSearch] = useState(params.q || "");

	function applySearch(e) {
		e.preventDefault();
		setParams((p) => ({ ...p, q: search, offset: 0 }));
		onReload();
	}

	async function createItem(e) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;
		const res = await fetch("/api/items", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: trimmed }),
		});
		if (res.ok) {
			setName("");
			onReload();
		} else {
			const err = await res.json().catch(() => ({}));
			alert(err.error || "Create failed");
		}
	}

	return (
		<div style={{ display: "grid", gap: 12, marginBottom: 16 }}>
			<form onSubmit={createItem} style={{ display: "flex", gap: 8 }}>
				<input
					placeholder="New item name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					style={{ flex: 1, padding: 8 }}
				/>
				<button type="submit">Add</button>
			</form>

			<form
				onSubmit={applySearch}
				style={{
					display: "flex",
					gap: 8,
					alignItems: "center",
					flexWrap: "wrap",
				}}
			>
				<input
					placeholder="Search..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ flex: 1, minWidth: 160, padding: 8 }}
				/>
				<select
					value={params.sort}
					onChange={(e) => setParams((p) => ({ ...p, sort: e.target.value }))}
				>
					<option value="id">Sort by ID</option>
					<option value="name">Sort by Name</option>
				</select>
				<select
					value={params.order}
					onChange={(e) => setParams((p) => ({ ...p, order: e.target.value }))}
				>
					<option value="asc">Asc</option>
					<option value="desc">Desc</option>
				</select>
				<select
					value={params.limit}
					onChange={(e) =>
						setParams((p) => ({
							...p,
							limit: Number(e.target.value),
							offset: 0,
						}))
					}
				>
					{[5, 10, 20, 50].map((n) => (
						<option key={n} value={n}>
							{n}/page
						</option>
					))}
				</select>
				<button type="submit">Apply</button>
			</form>
		</div>
	);
}

function ItemRow({ item, onReload }) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(item.name);

	async function save() {
		const res = await fetch(`/api/items/${item.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name: value }),
		});
		if (res.ok) {
			setEditing(false);
			onReload();
		} else {
			const err = await res.json().catch(() => ({}));
			alert(err.error || "Update failed");
		}
	}

	async function remove() {
		if (!confirm(`Delete "${item.name}"?`)) return;
		const res = await fetch(`/api/items/${item.id}`, { method: "DELETE" });
		if (res.ok || res.status === 204) onReload();
		else alert("Delete failed");
	}

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "64px 1fr auto",
				gap: 8,
				alignItems: "center",
				padding: "8px 0",
				borderBottom: "1px solid #eee",
			}}
		>
			<div style={{ color: "#666" }}>#{item.id}</div>
			{editing ? (
				<input
					value={value}
					onChange={(e) => setValue(e.target.value)}
					style={{ padding: 6 }}
				/>
			) : (
				<div>{item.name}</div>
			)}
			<div style={{ display: "flex", gap: 8 }}>
				{editing ? (
					<>
						<button type="button" onClick={save}>
							Save
						</button>
						<button type="button" onClick={() => setEditing(false)}>
							Cancel
						</button>
					</>
				) : (
					<button type="button" onClick={() => setEditing(true)}>
						Edit
					</button>
				)}
				<button type="button" onClick={remove} style={{ color: "#b00" }}>
					Delete
				</button>
			</div>
		</div>
	);
}

export default function ItemsPage() {
	const [params, setParams] = useState({
		q: "",
		sort: "id",
		order: "asc",
		limit: 5,
		offset: 0,
	});
	const [data, setData] = useState({
		items: [],
		meta: { total: 0, limit: 5, offset: 0 },
	});
	const [loading, setLoading] = useState(false);

	const apiUrl = useMemo(() => {
		const qs = new URLSearchParams();
		qs.set("sort", params.sort);
		qs.set("order", params.order);
		qs.set("limit", String(params.limit));
		qs.set("offset", String(params.offset));
		if (params.q) qs.set("q", params.q);
		const base = params.q ? "/api/items/search" : "/api/items";
		return `${base}?${qs.toString()}`;
	}, [params]);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(apiUrl);
			const json = await res.json();
			const meta = json.meta || {
				total: json.items?.length || 0,
				limit: params.limit,
				offset: params.offset,
			};
			setData({ items: json.items || [], meta });
		} catch (e) {
			console.error(e);
			alert("Failed to load items");
		} finally {
			setLoading(false);
		}
	}, [apiUrl, params.limit, params.offset]);

	useEffect(() => {
		load();
	}, [load]);

	const canPrev = data.meta.offset > 0;
	const canNext = data.meta.offset + data.meta.limit < (data.meta.total || 0);

	return (
		<main
			style={{
				maxWidth: 720,
				margin: "24px auto",
				fontFamily: "system-ui, sans-serif",
				padding: "0 16px",
			}}
		>
			<h1 style={{ marginBottom: 4 }}>Items</h1>
			<p style={{ marginTop: 0, color: "#666" }}>
				CRUD + search, sort, pagination
			</p>

			<Controls params={params} setParams={setParams} onReload={load} />

			<div style={{ borderTop: "1px solid #eee" }}>
				{loading ? (
					<div style={{ padding: 16 }}>Loading…</div>
				) : data.items.length ? (
					data.items.map((it) => (
						<ItemRow key={it.id} item={it} onReload={load} />
					))
				) : (
					<div style={{ padding: 16, color: "#666" }}>No items</div>
				)}
			</div>

			<div
				style={{
					display: "flex",
					gap: 8,
					alignItems: "center",
					justifyContent: "space-between",
					marginTop: 16,
				}}
			>
				<div style={{ color: "#666" }}>
					Total: {data.meta.total || 0} • Page:{" "}
					{Math.floor(data.meta.offset / data.meta.limit) + 1}
				</div>
				<div style={{ display: "flex", gap: 8 }}>
					<button
						type="button"
						onClick={() =>
							setParams((p) => ({
								...p,
								offset: Math.max(0, (p.offset || 0) - p.limit),
							}))
						}
						disabled={!canPrev}
					>
						Prev
					</button>
					<button
						type="button"
						onClick={() =>
							setParams((p) => ({ ...p, offset: (p.offset || 0) + p.limit }))
						}
						disabled={!canNext}
					>
						Next
					</button>
				</div>
			</div>
		</main>
	);
}
