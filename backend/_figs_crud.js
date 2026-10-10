const mongoose = require('mongoose');

// Real CRUD demo against the live raj-enterprises database
(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/raj-enterprises',
    { serverSelectionTimeoutMS: 8000 });
  const db = mongoose.connection.db;
  const col = db.collection('products');

  console.log('Connected to MongoDB - database: raj-enterprises');
  console.log('Collection under test: products\n');

  console.log('--- CREATE (insertOne) ---');
  const doc = {
    name: 'CRUD Demo Unit', brand: 'Raj Enterprises', category: 'demo',
    price: 1000, description: 'Temporary record created to demonstrate CRUD operations.',
    createdBy: 'experiment5'
  };
  const r1 = await col.insertOne(doc);
  console.log('insertOne -> acknowledged:', r1.acknowledged, ' insertedId:', String(r1.insertedId));
  const found1 = await col.findOne({ _id: r1.insertedId });
  console.log('findOne  ->', JSON.stringify({ _id: String(found1._id), name: found1.name,
    brand: found1.brand, price: found1.price }));

  console.log('\n--- READ (find + projection) ---');
  const list = await col.find({ category: 'demo' }, { projection: { name: 1, price: 1 } }).toArray();
  console.log('find({category:"demo"}) -> ' + list.length + ' document(s):');
  console.log(JSON.stringify(list, null, 2));

  console.log('\n--- UPDATE (updateOne) ---');
  const r2 = await col.updateOne({ _id: r1.insertedId }, { $set: { price: 1450, status: 'updated' } });
  console.log('updateOne -> matched:', r2.matchedCount, ' modified:', r2.modifiedCount);
  const after = await col.findOne({ _id: r1.insertedId });
  console.log('findOne  ->', JSON.stringify({ name: after.name, price: after.price, status: after.status }));

  console.log('\n--- DELETE (deleteOne) ---');
  const r3 = await col.deleteOne({ _id: r1.insertedId });
  console.log('deleteOne -> deletedCount:', r3.deletedCount);
  const left = await col.countDocuments({ category: 'demo' });
  console.log('countDocuments({category:"demo"}) ->', left);
  console.log('products remaining ->', await col.countDocuments());

  await mongoose.disconnect();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });