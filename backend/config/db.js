const mongoose = require('mongoose');

// Fail database operations fast instead of buffering for 10s when DB is down
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MongoDB not connected: MONGODB_URI is not set. Create backend/.env (see backend/.env.example).');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Server will keep running, but database-backed routes will fail until MongoDB is reachable.');
    return false;
  }
};

module.exports = connectDB;
