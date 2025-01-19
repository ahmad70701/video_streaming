import express,{ Router } from 'express';
import { getVideos, getVideo, addVideo, uploadVideo, completeUpload } from '../controllers/videosController.js';
import { isAuthenticated } from '../l/authMiddleware.js';
const videoRouter = Router();

videoRouter.get('/', getVideos);
videoRouter.get('/:id',  getVideo);
//Uploading Videos Start
videoRouter.post('/', isAuthenticated, addVideo);
videoRouter.post('/upload', isAuthenticated, express.raw({ type: 'multipart/form-data', limit: '100mb'}), uploadVideo);
videoRouter.post('/completeUpload', isAuthenticated, completeUpload);
//Uploading Videos End

export default videoRouter;
