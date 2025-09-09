import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import cors from 'cors';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import authRoutes from './routes/auth.js';
import addTest from './routes/test.js';
// import studentTestRoutes from './routes/studentTest.js';
import adminTestRoutes from './routes/adminTest.js';
import adminRoutes from "./routes/adminRoutes.js";
import submissionRoutes from './routes/submission.js';

dotenv.config(); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

connectDB();

app.get('/', (req, res) => {
    res.status(200).send("Hello from Backend")
})

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/test', addTest); 
// app.use('/api/v1/student/test', studentTestRoutes);
app.use('/api/v1/admin', adminTestRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use('/api/v1/submission', submissionRoutes);


app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`📊 Test endpoints:`);
    console.log(`   - GET /api/v1/test/with-status (requires auth)`);
    console.log(`   - GET /api/v1/submission/history (requires auth)`);
})