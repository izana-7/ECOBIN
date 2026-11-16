const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

let mongoMemoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecobin';

  try {
    // Attempt connecting to configured or local MongoDB instance
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[DB] Successfully connected to MongoDB at ${uri}`);
    return mongoose.connection;
  } catch (err) {
    console.log('[DB] Local/configured MongoDB unavailable. Trying MongoMemoryServer fallback...');

    // Try persistent disk-backed memory server for local dev (reuse existing data dir)
    try {
      const dbPath = path.join(__dirname, '..', 'data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'ecobin',
          dbPath,
          storageEngine: 'wiredTiger'
        }
      });
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[DB] Connected to persistent MongoMemoryServer at ${memoryUri} (dbPath: ${dbPath})`);
      return mongoose.connection;
    } catch (persistentErr) {
      console.warn('[DB] Persistent MongoMemoryServer unavailable (possibly locked/in use). Falling back to non-persistent in-memory MongoDB for this process.');
      console.warn(`[DB] Persistent fallback reason: ${persistentErr.message}`);

      try {
        if (mongoMemoryServer) {
          try { await mongoMemoryServer.stop(); } catch (_) {}
          mongoMemoryServer = null;
        }

        mongoMemoryServer = await MongoMemoryServer.create({
          instance: { dbName: 'ecobin' }
        });
        const memoryUri = mongoMemoryServer.getUri();
        await mongoose.connect(memoryUri);
        console.log(`[DB] Connected to non-persistent MongoMemoryServer at ${memoryUri}`);
        console.warn('[DB] Warning: data will not persist across restarts in this fallback mode.');
        return mongoose.connection;
      } catch (memErr) {
        console.error('[DB] Database connection error:', memErr);
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
