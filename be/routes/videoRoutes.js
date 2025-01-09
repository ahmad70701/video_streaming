import express,{ Router } from 'express';
import { getVideos, getVideo, addVideo, uploadVideo, completeUpload } from '../controllers/videosController.js';

const videoRouter = Router();


videoRouter.get('/', getVideos);
videoRouter.post('/', addVideo);
videoRouter.post('/upload', express.raw({ type: 'multipart/form-data', limit: '100mb'}), uploadVideo);
videoRouter.post('/completeUpload', completeUpload);

videoRouter.get('/:id', getVideo);


export default videoRouter;
