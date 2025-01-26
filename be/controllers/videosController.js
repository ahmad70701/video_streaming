import {getOneVideo, getAllVideos, addVideoToDB, deleteVideoFromDB} from "../models/videos.js";
import { randomUUID } from "crypto";
import fs from 'fs';
import { Buffer } from 'node:buffer';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { uploadFile } from "../services/fileUploadService.js";
import { stat } from "node:fs";

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
        const status = await uploadFile(req.file, req.form);
        console.log(status);
        if (!status) return res.status(500).json({ 'messsage': 'error saving the file!' });    
        return res.status(202).json({'chunk index saved':req.form['chunkIndex']});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export async function completeUpload(req, res) {
    try {
        const {uploadID, fileName} = req.body;
        const chunksFolderPath = path.join(__dirname, `/tmp/${uploadID}/chunks`);
        const outputFileName = path.join(__dirname, `/tmp/${uploadID}/${fileName}`);
        res.status(200).json('All chunks uploaded, File will be processed');
        const streamURLS = await processFiles(chunksFolderPath, outputFileName, fileName, uploadID, res);
        console.log('Upload Completed!')
        console.log(streamURLS)
        // const filePath = path.join(__dirname,`/tmp/${uploadID}`)
        // transcodeVideo(filePath, fileName);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

async function processFiles(folderPath, outputFileName,fileName,uploadID,res) {
    try {
        // Read all file names in the folder
        let files = await fs.promises.readdir(folderPath);

        // Filter and sort files numerically by their names
        files = files
            .filter(file => /^\d+$/.test(file)) // Keep only files with numeric names
            .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically

        let concatenatedBuffer = Buffer.alloc(0);

        // Read and concatenate all buffers
        for (const file of files) {
            const filePath = path.join(folderPath, file);

            // Read the file's buffer
            const fileBuffer = await fs.promises.readFile(filePath);
            concatenatedBuffer = Buffer.concat([concatenatedBuffer, fileBuffer]);
        }

        // Write the concatenated buffer to a new file
        // const outputFilePath = path.join(folderPath, outputFileName);
        await fs.promises.writeFile(outputFileName, concatenatedBuffer);

        // Delete the original files
        await fs.promises.rm(folderPath, { recursive: true, force: true });

        const filePath = path.join(__dirname, `/tmp/${uploadID}/${fileName}`)
        return transcodeVideo(filePath, fileName,uploadID);

    } catch (error) {
        console.error('Error processing files:', error);
    }
}

async function transcodeVideo(inputPath, fileName, uploadID) {
    const resolutions = [
      { width: 1920, height: 1080, folder: '1080p' },
      { width: 1280, height: 720, folder: '720p' },
      { width: 854, height: 480, folder: '480p' },
    ];
  
    const publicDir = path.join(__dirname, `/public/uploads/videos/${uploadID}`);
    const streamURLS = [];
  
    try {
      // Create directories and process resolutions sequentially
      for (const { width, height, folder } of resolutions) {
        const outputDir = path.join(publicDir, folder);
        await fs.promises.mkdir(outputDir, { recursive: true });
  
        const outputFileName = path.basename(fileName, path.extname(fileName)) + '.m3u8';
        const outputPath = path.join(outputDir, outputFileName);
  
        // Wrap transcoding in a Promise to handle asynchronous behavior
        await new Promise((resolve, reject) => {
          ffmpeg(inputPath)
            .outputOptions([
              '-codec:v libx264',
              '-preset veryfast',
              '-codec:a aac',
              '-ac 2',
              '-strict -2',
              '-f hls',
              '-hls_time 4',
              '-hls_playlist_type vod',
            ])
            .size(`${width}x${height}`)
            .output(outputPath)
            .on('start', () => {
              console.log(`Transcoding started for resolution ${width}x${height}`);
            })
            .on('error', (err) => {
              console.error(`Error while transcoding: ${err.message}`);
              reject(err);
            })
            .on('end', async () => {
              console.log(`Transcoding completed for resolution ${width}x${height}`);
              const streamUrl = `/uploads/videos/${uploadID}/${folder}/${outputFileName}`;
  
              // Push URL to the array and update the database
              streamURLS.push(streamUrl);
              await Video.findByIdAndUpdate(uploadID.split('=')[0], {
                $push: { fileUrl: streamUrl },
              });
  
              resolve();
            })
            .run();
        });
      }
  
      console.log('All resolutions processed:', streamURLS);
      return streamURLS;
    } catch (err) {
        
      console.error('Error during transcoding:', err.message);
      throw err;
    }
  }
  