const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecobin';
  
  try {
    // Attempt connecting to configured or local MongoDB instance
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[DB] Successfully connected to MongoDB at ${uri}`);
  } catch (err) {
    console.log('[DB] Local MongoDB unavailable. Starting persistent MongoMemoryServer fallback...');
    try {
      // Ensure data directory exists for disk persistence
      const dbPath = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'ecobin',
          dbPath: dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[DB] Connected to Persistent MongoDB Storage at ${memoryUri}`);
    } catch (memErr) {
      console.log('[DB] Fallback to standard memory server mode...');
      try {
        mongoMemoryServer = await MongoMemoryServer.create({
          instance: { dbName: 'ecobin' }
        });
        await mongoose.connect(mongoMemoryServer.getUri());
      } catch (e) {
        console.error('[DB] Database connection error:', e);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
