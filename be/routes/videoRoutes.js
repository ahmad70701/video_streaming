import express,{ Router } from 'express';
import { getVideos, getVideo, addVideo, uploadVideo, completeUpload } from '../controllers/videosController.js';
import { query } from 'express-validator';

const videoRouter = Router();

videoRouter.get('/', getVideos);
videoRouter.get('/:id',  getVideo);
//Uploading Videos Start
videoRouter.post('/', addVideo);
videoRouter.post('/upload', express.raw({ type: 'multipart/form-data', limit: '100mb'}), uploadVideo);
videoRouter.post('/completeUpload', completeUpload);
//Uploading Videos End

export default videoRouter;
