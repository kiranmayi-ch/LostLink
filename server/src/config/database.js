import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isMemory: false };
}

let memoryServerInstance = null;

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  const configuredUri = process.env.MONGODB_URI;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    // Attempt direct connection first if URI is provided and not 'inmemory'
    if (configuredUri && configuredUri !== 'inmemory') {
      cached.promise = mongoose.connect(configuredUri, opts).then((m) => {
        console.log(`[Database] Connected to MongoDB: ${m.connection.host}/${m.connection.name}`);
        return m;
      }).catch(async (err) => {
        console.warn(`[Database] Direct connection to ${configuredUri} failed: ${err.message}`);
        
        // In local development or testing, fall back to in-memory MongoDB automatically
        if (process.env.NODE_ENV !== 'production') {
          console.log('[Database] Falling back to embedded MongoDB Memory Server for local development/testing...');
          const { MongoMemoryServer } = await import('mongodb-memory-server');
          memoryServerInstance = await MongoMemoryServer.create();
          const memoryUri = memoryServerInstance.getUri();
          cached.isMemory = true;
          return mongoose.connect(memoryUri, opts).then((m) => {
            console.log(`[Database] In-Memory MongoDB running at: ${memoryUri}`);
            return m;
          });
        }
        throw err;
      });
    } else {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'MONGODB_URI must be configured in production.'
    );
  }

  console.log('[Database] Initializing MongoDB Memory Server...');

  const { MongoMemoryServer } = await import('mongodb-memory-server');
  memoryServerInstance = await MongoMemoryServer.create();
  const memoryUri = memoryServerInstance.getUri();

  cached.isMemory = true;
  cached.promise = mongoose.connect(memoryUri, opts).then((m) => {
    console.log('[Database] In-Memory MongoDB initialized.');
    return m;
  });
}
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
  }
  cached.conn = null;
  cached.promise = null;
};
