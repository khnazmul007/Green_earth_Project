# Green Earth – Tree Planting Campaign Site

A fully responsive, vanilla JavaScript site that loads tree categories and plants from public APIs, supports cart with total and removal, modal details, loading spinner, and form pledge. Built with HTML + Tailwind + DaisyUI + Vanilla JS.

## Run Locally
- Open `index.html` directly in a browser.
- Ensure internet connection for API/Tailwind/DaisyUI CDNs.

## Features
- Navbar with logo, menu, and Plant a Tree button
- Banner with background image, title, subtitle, CTA
- About section with image-left, text-right
- Our Impact stats
- Dynamic categories (active state)
- Plants by category (3-column responsive grid)
- Card contains image, name (opens modal), description, category, price, Add to Cart
- Modal with full plant details
- Cart add/remove with total calculation
- Loading spinner during API requests
- Pledge form (name, email, number of trees)
- Responsive mobile-first layout

## ES6 Q&A

### 1) What is the difference between var, let, and const?
- `var`: Function-scoped, hoisted (initialized as undefined), allows re-declaration and reassignment. Avoid in modern code.
- `let`: Block-scoped, hoisted but not initialized (Temporal Dead Zone), no re-declaration in same scope, allows reassignment.
- `const`: Block-scoped, must be initialized at declaration, no reassignment; object/array contents can still be mutated.

### 2) What is the difference between map(), forEach(), and filter()?
- `forEach`: Iterates for side effects, ignores return value. Does not create a new array.
- `map`: Transforms each element and returns a new array of the same length.
- `filter`: Keeps elements that pass a predicate and returns a new (possibly shorter) array.

### 3) What are arrow functions in ES6?
- A concise function syntax: `const add = (a,b) => a + b`.
- Lexically binds `this`, `arguments`, `super`, and `new.target` (no own `this`).
- Not constructible (no `new`), no `prototype`, often shorter and clearer for callbacks.

### 4) How does destructuring assignment work in ES6?
- Unpacks values from arrays/objects into distinct variables.
```js
const [x, y = 0] = arr; // array with default
const { id, name: title, price = 0 } = obj; // rename + default
const { nested: { value } } = obj; // nested destructuring
```
- Supports defaults, renaming, rest (`...rest`), and nested structures.

### 5) Explain template literals in ES6. How are they different from string concatenation?
- Backtick strings supporting interpolation and multiline.
```js
const user = 'Ava';
const count = 3;
const msg = `Hi ${user}, you pledged ${count} trees!`;
```
- Differences: cleaner interpolation (`${}`) vs `'Hi ' + user + ...'`, preserves newlines/whitespace, supports tagged templates for advanced processing.
