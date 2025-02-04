import express, { Router } from 'express';
import { getVideos, getVideo, addVideo, uploadVideo, completeUpload, deleteVideo, checkVideoStatus } from '../controllers/videosController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { multiPartParser } from '../middlewares/multiPartParser.js';
import multipart from 'parse-multipart-data';

const videoRouter = Router();


videoRouter.get('/', getVideos);
videoRouter.get('/:id',  getVideo);
videoRouter.delete('/:id', isAuthenticated, deleteVideo);
//Uploading Videos Start
videoRouter.post('/', addVideo);
videoRouter.post('/upload',isAuthenticated,
    multiPartParser, 
    uploadVideo
);
videoRouter.post('/completeUpload',isAuthenticated,
    completeUpload
);
//Uploading Videos End
videoRouter.get('/checkVideoStatus', isAuthenticated, checkVideoStatus);

export default videoRouter;