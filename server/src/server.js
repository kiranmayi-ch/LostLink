import app from './app.js';
import { connectDB, disconnectDB } from './config/database.js';
import User from './models/User.js';
import { seed } from './seed.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed in development if database is fresh and empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[LostLink Server] Fresh database detected. Initializing campus data...');
      await seed(false);
    }

    const server = app.listen(PORT, () => {
      console.log(`[LostLink Server] Running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`[LostLink Server] Health check available at: http://localhost:${PORT}/api/health`);
    });

    const shutdown = async (signal) => {
      console.log(`\n[LostLink Server] ${signal} signal received: closing HTTP server...`);
      server.close(async () => {
        console.log('[LostLink Server] HTTP server closed.');
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[LostLink Server] Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
