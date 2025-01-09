import Video from "../models/videos.js";
import { randomUUID } from "crypto";
import fs from 'fs';
import { Buffer } from 'node:buffer';
import path from 'path';

const __dirname = path.resolve();
export async function getVideos(req, res) {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

export async function getVideo(req,res) {
    console.log(req.params.id);
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export async function addVideo(req, res) {
    try {
        const uniqueID = randomUUID(); 
        const { title, tags, description } = req.body;
        const existingVideo = await Video.findOne({ title: title });
        if (existingVideo) {
            return res.status(409).json({ error: 'A video with this title already exists.' });
        }
        const video = new Video({
            title: title,
            tags: tags,
            description: description,
            fileUrl: '',
        });
        const savedVideo = await video.save();
        const id = savedVideo._id.toString(); 
        res.status(200).json({ uploadKey: `${id}=${uniqueID}` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


export async function uploadVideo(req, res) {
    const boundary = req.headers['content-type'].split('boundary=')[1];
    const boundaryBuffer = Buffer.from('\r\n'+boundary + '--\r\n');

    const parts = req.body.toString("utf8").split('--' + boundary);
    let chunk = [];
    const formData = {}
    parts.forEach(part => {
        //formdata
        if (part.includes('Content-Disposition')&&!part.includes('filename')) {
            let [key,value] = part.split('Content-Disposition: ')[1].split('form-data; name=')[1].split('\r\n\r\n');
            formData[key.replace(/^"|"$/g, '')] = value.trim();
        }
        //fileData
        else if(part.includes('Content-Disposition') && part.includes('filename')) {
            let [key, value] = part.split('Content-Disposition: ')[1].split('form-data; name=')[1].split('\r\n\r\n');
            let bufferToIndex = Buffer.from(key + '\r\n\r\n');
            let index = req.body.indexOf(bufferToIndex)+ bufferToIndex.length
            chunk.push(req.body.slice(index,(req.body.length - boundaryBuffer.length-2)))
        }
    });
    const chunksFolderPath = path.join(__dirname, `/tmp/${formData['uploadKey']}/chunks`);
    const chunkFilePath = path.join(chunksFolderPath, `${formData['chunkIndex']}`);
    fs.promises.mkdir(chunksFolderPath, { recursive: true })
        .then(() => {
            const writeStream = fs.createWriteStream(chunkFilePath);
            writeStream.write(chunk[0]);
            writeStream.end();
            writeStream.on('finish', () => {
                // console.log('File written successfully!');
            });
            writeStream.on('error', (err) => {
                console.error('Error writing file:', err);
            });
        });
    try {
        res.status(202).json({'chunk':formData['chunkIndex']});
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

export async function completeUpload(req, res) {
    try {
        const {uploadID, fileName} = req.body;
        const chunksFolderPath = path.join(__dirname, `/tmp/${uploadID}/chunks`);
        const outputFileName = path.join(__dirname, `/tmp/${uploadID}/${fileName}`);
        await processFiles(chunksFolderPath, outputFileName);
        console.log('Upload Completed!')
        res.status(200).json('Upload Completed');

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

async function processFiles(folderPath, outputFileName) {
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
        
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

