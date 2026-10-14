require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.argv[2] || process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: No connection string provided.');
  console.error('Usage: node testConnection.js "<mongodb_connection_uri>" or set MONGODB_URI in backend/.env');
  process.exit(1);
}

// Mask password for display
const maskedUri = uri.replace(/\/\/(.*?):(.*?)@/, '//$1:******@');
console.log(`\nConnecting to: ${maskedUri}`);

(async () => {
  const start = Date.now();
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    const latency = Date.now() - start;
    console.log(`[SUCCESS] Connected to MongoDB host: ${conn.connection.host}`);
    console.log(`Database name: ${conn.connection.name}`);
    console.log(`Latency: ${latency}ms`);

    const admin = conn.connection.db.admin();
    const buildInfo = await admin.buildInfo();
    console.log(`MongoDB version: ${buildInfo.version}`);

    const collections = await conn.connection.db.listCollections().toArray();
    console.log(`Collections count: ${collections.length}`);
    if (collections.length > 0) {
      console.log(`Collections: ${collections.map(c => c.name).join(', ')}`);
    }

    await mongoose.disconnect();
    console.log('Connection test completed successfully.\n');
    process.exit(0);
  } catch (error) {
    console.error(`\n[FAILED] Connection failed: ${error.message}\n`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('-> Hint: Check your database username and password in the connection URI.');
    } else if (error.message.includes('querySrv ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('-> Hint: Check your cluster hostname or internet connection.');
    } else if (error.message.includes('IP') || error.message.includes('timed out')) {
      console.error('-> Hint: Check MongoDB Atlas Network Access. Ensure IP 0.0.0.0/0 (or your current IP) is added to the IP Access List.');
    }
    process.exit(1);
  }
})();
