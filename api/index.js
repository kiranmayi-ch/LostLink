import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/database.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('[Vercel Serverless Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Serverless execution error connecting to database',
      error: process.env.NODE_ENV !== 'production' ? error.message : undefined,
    });
  }
}
