import express, {json} from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import videoRouter from './routes/videoRoutes.js';
import path from 'path';
import multer from 'multer';

const __dirname = path.resolve();

// init
config();
connectDB();
const app = express();



// Middleware
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

//App Routes
app.use('/api/videos', videoRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.status(404).json('Oops! The page you are looking for does not exist.');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
