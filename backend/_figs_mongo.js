const mongoose = require('mongoose');

(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/raj-enterprises',
    { serverSelectionTimeoutMS: 8000 });
  const db = mongoose.connection.db;
  console.log('Connected to MongoDB 8.0 - database: raj-enterprises\n');

  console.log('$ show collections');
  const cols = (await db.listCollections().toArray()).map(c => c.name).sort();
  console.log(cols.join('  '));

  console.log('\n$ db.products.countDocuments()');
  console.log(await db.collection('products').countDocuments());

  console.log('\n$ db.products.findOne({ category: "domestic-ro" })');
  const p = await db.collection('products').findOne({ category: 'domestic-ro' });
  console.log(JSON.stringify({
    _id: p._id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    variants: (p.variants || []).map(v => v.colour || v.name).slice(0, 4)
  }, null, 2));

  console.log('\n$ db.servicetickets.find().limit(1)');
  const t = await db.collection('servicetickets').findOne({});
  console.log(JSON.stringify({
    _id: t._id,
    ticketId: t.ticketId,
    customerName: t.customerName,
    serviceType: t.serviceType,
    status: t.status,
    statusHistory: (t.statusHistory || []).map(h => h.status)
  }, null, 2));

  await mongoose.disconnect();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });