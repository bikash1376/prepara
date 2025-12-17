import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import authRoutes from './routes/auth.js';
import addTest from './routes/test.js';
// import studentTestRoutes from './routes/studentTest.js';
import adminTestRoutes from './routes/adminTest.js';
import adminRoutes from "./routes/adminRoutes.js";
import submissionRoutes from './routes/submission.js';
import uploadRoutes from './routes/upload.js';

dotenv.config();

// Debug: Check if environment variables are loaded
// console.log('Environment check:');
// console.log('CLERK_SECRET_KEY exists:', !!process.env.CLERK_SECRET_KEY);
// console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
// console.log('PORT:', process.env.PORT); 

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://prepara-eight.vercel.app', 'https://prepara.bksh.site'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'b3', // <-- ADD THIS
    'X-B3-TraceId', // Optional, but good to have
    'X-B3-SpanId',  // Optional, but good to have
    'X-B3-Sampled'  // Optional, but good to have
  ] 
}));
// Initialize Cloudinary configuration
import './config/cloudinary.js';

connectDB();

app.get('/', (req, res) => {
    res.status(200).send("Hello from Backend")
})

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/test', addTest); 
// app.use('/api/v1/student/test', studentTestRoutes);
app.use('/api/v1/admin', adminTestRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use('/api/v1/submissions', submissionRoutes);

// File upload routes
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  // Log the error with stack trace in development
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // console.error('\n--- Error ---');
  // console.error('Path:', req.path);
  // console.error('Method:', req.method);
  // console.error('Error:', err.message);
  if (isDevelopment) {
    // console.error('Stack:', err.stack);
  }
  // console.error('--- End Error ---\n');
  
  // Set headers for JSON response
  res.setHeader('Content-Type', 'application/json');
  
  // Handle different types of errors
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    // JWT authentication error
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid or missing token'
    });
  }
  
  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal Server Error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
})