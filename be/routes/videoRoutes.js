import express,{ Router } from 'express';
import { getVideos, getVideo, addVideo, uploadVideo, completeUpload, deleteVideo } from '../controllers/videosController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { multiPartParser } from '../middlewares/multiPartParser.js';
const videoRouter = Router();

videoRouter.get('/', getVideos);
videoRouter.get('/:id',  getVideo);
videoRouter.delete('/:id', isAuthenticated, deleteVideo);
//Uploading Videos Start
videoRouter.post('/', isAuthenticated, addVideo);
videoRouter.post('/upload', isAuthenticated, express.raw({ type: 'multipart/form-data', limit: '100mb'}), multiPartParser, uploadVideo);
videoRouter.post('/completeUpload', isAuthenticated, completeUpload);
//Uploading Videos End

export default videoRouter;
