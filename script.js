// Green Earth - Main JS

const API = {
	allPlants: 'https://openapi.programming-hero.com/api/plants',
	categories: 'https://openapi.programming-hero.com/api/categories',
	byCategory: (id) => `https://openapi.programming-hero.com/api/category/${id}`,
	plantDetail: (id) => `https://openapi.programming-hero.com/api/plant/${id}`,
};

const state = {
	categories: [],
	activeCategoryId: 'all',
	plants: [],
	cart: [],
	isLoading: false,
};

// Utilities
function $(selector, root = document) { return root.querySelector(selector); }
function $all(selector, root = document) { return Array.from(root.querySelectorAll(selector)); }
function formatCurrency(amount) { return String(Math.round(Number(amount || 0))); }
function setLoading(isLoading) { state.isLoading = isLoading; const spinner = $('#spinner'); if (spinner) spinner.classList.toggle('hidden', !isLoading); }

function setActiveCategory(categoryId) {
	state.activeCategoryId = categoryId;
	$all('.category-item').forEach((el) => { el.classList.toggle('active', el.dataset.id === String(categoryId)); });
}

async function fetchJSON(url) { setLoading(true); try { const res = await fetch(url); if (!res.ok) throw new Error(`Request failed: ${res.status}`); return await res.json(); } finally { setLoading(false); } }

// Categories
async function loadCategories() {
	const data = await fetchJSON(API.categories);
	const raw = data?.categories || data?.data || [];
	const desired = [
		'Fruit Trees',
		'Flowering Trees',
		'Shade Trees',
		'Medicinal Trees',
		'Timber Trees',
		'Evergreen Trees',
		'Ornamental Plants',
		'Bamboo',
		'Climbers',
		'Aquatic Plants',
	];
	const zipped = desired.map((label, idx) => {
		const r = raw[idx] || {};
		return { id: r.id || r._id || r.category_id || r.slug || String(idx + 1), category: label };
	});
	const categories = [{ id: 'all', category: 'All Trees' }, ...zipped];
	state.categories = categories;
	renderCategories(categories);
	handleCategoryClick('all');
}

function renderCategories(categories) {
	const list = $('#category-list');
	if (!list) return;
	list.innerHTML = '';
	categories.forEach((cat) => {
		const item = document.createElement('button');
		item.type = 'button';
		item.className = 'category-item';
		item.dataset.id = String(cat.id);
		item.textContent = cat.category || cat.name || `Category ${cat.id}`;
		item.addEventListener('click', () => handleCategoryClick(cat.id));
		list.appendChild(item);
	});
	setActiveCategory(state.activeCategoryId);
}

async function handleCategoryClick(categoryId) {
	setActiveCategory(categoryId);
	let plants = [];
	if (String(categoryId) === 'all') {
		const dataAll = await fetchJSON(API.allPlants);
		plants = dataAll?.data || dataAll?.plants || [];
	} else {
		const data = await fetchJSON(API.byCategory(categoryId));
		plants = data?.data || data?.plants || [];
	}
	state.plants = plants;
	renderCards(plants);
}

// Cards
function renderCards(plants) {
	const grid = $('#cards-grid');
	grid.innerHTML = '';
	if (!plants || plants.length === 0) { grid.innerHTML = '<div class="col-span-full text-center opacity-70">No trees found in this category.</div>'; return; }
	plants.forEach((plant) => {
		const { id, name, image, price, description, category } = normalizePlant(plant);
		const card = document.createElement('div');
		card.className = 'card bg-white shadow border border-base-200';
		card.innerHTML = `
			<figure class="p-4">
				<img class="card-img" src="${image}" alt="${name}" />
			</figure>
			<div class="card-body pt-0">
				<h2 class="card-title"><button class="link link-primary plant-name" data-id="${id}">${name}</button></h2>
				<p class="text-sm opacity-80">${shorten(description, 98)}</p>
				<div class="flex items-center justify-between text-sm">
					<span class="badge badge-neutral">${category}</span>
					<span class="font-semibold">৳${formatCurrency(price)}</span>
				</div>
				<div class="card-actions justify-end mt-3">
					<button class="btn btn-primary btn-sm add-to-cart" data-id="${id}">Add to Cart</button>
				</div>
			</div>
		`;
		grid.appendChild(card);
	});
	$all('.add-to-cart', grid).forEach((btn) => btn.addEventListener('click', onAddToCart));
	$all('.plant-name', grid).forEach((btn) => btn.addEventListener('click', onOpenModal));
}

function normalizePlant(raw) { return { id: raw.id || raw.plantId || raw._id || String(raw?.name).replace(/\s+/g, '-'), name: raw.name || raw.plantName || 'Unknown Tree', image: raw.image || raw.img || 'https://placehold.co/600x400?text=Tree', price: raw.price || raw.cost || 0, description: raw.description || raw.details || 'A beautiful tree species documented in our open dataset.', category: raw.category || raw.type || 'General', }; }
function shorten(text, max = 100) { const t = String(text || ''); return t.length > max ? `${t.slice(0, max - 1)}…` : t; }

// Modal
function onOpenModal(e) {
	const id = e.currentTarget.dataset.id;
	const plant = state.plants.map(normalizePlant).find((p) => String(p.id) === String(id));
	if (!plant) return;
	
	const modal = $('#plant-modal');
	$('#modal-title').textContent = plant.name;
	$('#modal-content').innerHTML = `
		<img class="modal-img mb-3" src="${plant.image}" alt="${plant.name}">
		<p class="mb-2">${plant.description}</p>
		<div class="flex items-center justify-between">
			<span class="badge badge-neutral">${plant.category}</span>
			<span class="font-semibold">৳${formatCurrency(plant.price)}</span>
		</div>
	`;
	modal.showModal();
}

// Cart
function onAddToCart(e) { const id = e.currentTarget.dataset.id; const plant = state.plants.map(normalizePlant).find((p) => String(p.id) === String(id)); if (!plant) return; state.cart.push(plant); renderCart(); }
function removeFromCartById(id) { state.cart = state.cart.filter((p) => String(normalizePlant(p).id) !== String(id)); renderCart(); }
function renderCart() {
	const list = $('#cart-list');
	// Group items by id to show quantity like the design
	const grouped = new Map();
	state.cart.map(normalizePlant).forEach((p) => {
		const key = String(p.id);
		if (!grouped.has(key)) grouped.set(key, { item: p, qty: 0 });
		grouped.get(key).qty += 1;
	});
	const items = Array.from(grouped.values());
	const total = items.reduce((sum, g) => sum + Number(g.item.price || 0) * g.qty, 0);
	$('#cart-count').textContent = String(state.cart.length);
	$('#cart-total').textContent = formatCurrency(total);
	list.innerHTML = '';
	items.forEach(({ item, qty }) => {
		const li = document.createElement('li');
		li.className = 'cart-item';
		li.innerHTML = `
			<div class="flex flex-col">
				<span class="cart-item-title">${item.name}</span>
				<span class="opacity-70 text-xs">৳${formatCurrency(item.price)} × ${qty}</span>
			</div>
			<button class="cart-remove" aria-label="Remove" title="Remove">✖</button>
		`;
		li.querySelector('.cart-remove').addEventListener('click', () => removeFromCartById(item.id));
		list.appendChild(li);
	});
}

// Form
function initForm() { const form = $('#pledge-form'); if (!form) return; form.addEventListener('submit', (e) => { e.preventDefault(); const formData = new FormData(form); const name = formData.get('name'); const email = formData.get('email'); const count = Number(formData.get('count')) || 1; alert(`Thank you, ${name}! Your pledge for ${count} tree(s) has been received. We'll contact you at ${email}.`); form.reset(); }); }
function setYear() { const yearEl = $('#year'); if (yearEl) yearEl.textContent = String(new Date().getFullYear()); }

// App init
async function init() { setYear(); initForm(); await loadCategories(); }

document.addEventListener('DOMContentLoaded', init);
