import {getOneVideo, getAllVideos, addVideoToDB, deleteVideoFromDB, changeVideoStatus} from "../models/videos.js";
import { randomUUID } from "crypto";
import fs from 'fs';
import { Buffer } from 'node:buffer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { uploadFile, completeFileUpload } from "../services/fileUploadService.js";
import { stat } from "node:fs";
import { addToTranscodeQueue } from "../services/transcodingService.js";

const __dirname = path.resolve();

export async function getVideos(req, res) {
    try {
        const videos = await getAllVideos();
        res.status(200).json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
}

export async function getVideo(req,res) {
    try {
        const video = await getOneVideo(req.params.id);
        res.status(200).json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message})
    }
}

export async function addVideo(req, res) {
    try {
        const { title, tags, description } = req.body;
        const uploadID = randomUUID(); 
        const videoID = await addVideoToDB(title, tags, description);
        if (!videoID) return res.status(409).json({ error: 'A video with this title already exists.' });
        return res.status(200).json({ uploadKey: `${videoID}=${uploadID}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export async function deleteVideo(req, res) {
    try {
        await deleteVideoFromDB(req.params.id);
        return res.status(200).json({ message: `${req.params.id} has been removed!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export async function uploadVideo(req, res) {
    try {
        const status = await uploadFile(req.file[0].buffer, req.form);
        if (!status) return res.status(500).json({ 'messsage': 'error saving the file!' });    
        return res.status(202).json({'chunk index saved':req.form['chunkIndex']});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export async function completeUpload(req, res) {
    try {
      const { uploadID, fileName } = req.body;
      await changeVideoStatus(uploadID.split('=')[0], 'Assembling Chunks');
      res.status(200).json('All chunks uploaded, File will be processed');
      const filePath = await completeFileUpload(uploadID, fileName);
      await changeVideoStatus(uploadID.split('=')[0], 'Added to transcoding queue!');
      await addToTranscodeQueue(filePath, fileName, uploadID);
      console.log('Upload Completed!');
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export async function checkVideoStatus(req, res) {
    
}

