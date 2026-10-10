// Exp 2 - real ES6 features used by the Raj Enterprises frontend, executed in Node
const API = 'http://localhost:5000/api';

console.log('=== Raj Enterprises ES6 Feature Demonstration ===\n');

// 1. let / const
const business = 'Raj Enterprises';
let completed = 0;
console.log(`1. const + template literal -> "${business}" / Navi Mumbai RO services`);

// 2. Arrow function
const double = (n) => n * 2;
console.log(`2. Arrow function           -> double(21) = ${double(21)}`);

// 3. Anonymous function (callback)
console.log('3. Anonymous function       -> ' +
  [1, 2, 3, 4].map(function (n) { return n ** 2; }).join(', '));

// 4. Array + destructuring
const products = [
  { name: 'AROMA Smart Touch', price: 12500, category: 'domestic-ro' },
  { name: 'KENT Grand Ultra', price: 18900, category: 'domestic-ro' },
  { name: 'AMC Basic Plan', price: 2499, category: 'amc' }
];
const [first, , third] = products;
console.log(`4. Destructuring            -> first="${first.name}" third="${third.name}"`);

// 5. Array methods: filter + reduce
const domestic = products.filter(({ category }) => category === 'domestic-ro');
const total = products.reduce((sum, p) => sum + p.price, 0);
console.log(`5. filter() + reduce()      -> ${domestic.length} domestic units, catalogue total Rs.${total}`);

// 6. spread + default + optional chaining (as used in BookingForm.jsx)
const base = { brand: 'Raj Enterprises', warranty: '1 Year' };
const merged = { ...base, warranty: '1 Year', area: 'Navi Mumbai' };
console.log('6. Spread + default         -> ' + JSON.stringify(merged));

// 7. Map + Set
console.log('7. new Map()/Set()          -> unique categories: ' +
  JSON.stringify([...new Set(products.map(p => p.category))]));

// 8. Promise (asynchronous API call used by the app)
(async () => {
  const res = await fetch(`${API}/products`);
  const json = await res.json();
  const list = json.products || [];
  completed = list.length;
  console.log(`8. async/await + fetch()    -> GET /api/products returned ${completed} products`);
  console.log(`   first product            -> "${list[0].name}" (Rs.${list[0].price})`);
  console.log('\n=== All ES6 demonstrations completed ===');
  process.exit(0);
})().catch(e => { console.error('fetch failed:', e.message); process.exit(1); });