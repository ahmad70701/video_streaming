import express, { json } from 'express';
import { config } from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';

config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
