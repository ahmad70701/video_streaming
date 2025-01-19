import express, {json} from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import path from 'path';
import videoRouter from './routes/videoRoutes.js';
import userRouter from './routes/userRoutes.js';
const __dirname = path.resolve();

// init
config();
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(json());
app.use(express.urlencoded({ extended: true }));

//App Routes
app.use('/api/videos', videoRouter);
app.use('/api/users', userRouter);

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/index', express.static(path.join(__dirname, 'public/fe/index.html')));
app.use('/video', express.static(path.join(__dirname, 'public/fe/video.html')));
app.use('/upload', express.static(path.join(__dirname, 'public/fe/new-file-upload.html')));

app.use((req, res, next) => {
    res.status(404).json('Oops! The page you are looking for does not exist.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
