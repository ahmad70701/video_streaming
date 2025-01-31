import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { addVideoURLs } from '../models/videos.js';

const __dirname = path.resolve();

export async function addToTranscodeQueue(inputPath, fileName, uploadID) {
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
              await addVideoURLs(uploadID.split('=')[0],streamURLS);
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
  