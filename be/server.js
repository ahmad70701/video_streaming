import express, {json} from 'express';
import { config } from 'dotenv';
import connectDB from './config/db.js';
import cors from 'cors';
import videoRouter from './routes/videoRoutes.js';
import path from 'path';

const __dirname = path.resolve();

// init
config();
connectDB();
const app = express();
app.use(cors());



// Middleware


app.use(express.urlencoded({ extended: false }));
app.use(json());
//App Routes
app.use('/api/videos', videoRouter);
app.use('/public', express.static(path.join(__dirname, 'public')));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
