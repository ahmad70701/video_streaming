import express, {json} from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import videoRouter from './routes/videoRoutes.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const __dirname = path.resolve();

// init
config();
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//App Routes
app.use('/api/videos', videoRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public/fe')));
app.use((req, res, next) => {
    return res.status(404).json('Oops! The page you are looking for does not exist.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
