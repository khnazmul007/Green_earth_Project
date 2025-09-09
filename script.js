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
