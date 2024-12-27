import { Router } from 'express';
import { getVideos, getVideo, addVideo } from '../controllers/videosController.js';
import multer from 'multer';
import path from 'path';

const __dirname = path.resolve();

const videoRouter = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads/videos');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage:storage })


videoRouter.get('/', getVideos);
videoRouter.post('/', upload.single('video'), addVideo);
videoRouter.get('/:id', getVideo);


export default videoRouter;
