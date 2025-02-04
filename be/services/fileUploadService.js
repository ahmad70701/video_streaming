import fs, { createWriteStream } from 'fs';
import path from 'path';


const __dirname = path.resolve();

export async function uploadFile(chunk, formData) {
    const chunksFolderPath = path.join(__dirname, `/tmp/${formData['uploadKey']}/chunks`);
    const chunkFilePath = path.join(chunksFolderPath, `${formData['chunkIndex']}`);
    try {
        await fs.promises.mkdir(chunksFolderPath, { recursive: true });
        const writeStream = fs.createWriteStream(chunkFilePath);
        writeStream.write(chunk);
        writeStream.end();
        const status = await new Promise((resolve, reject) => {
            writeStream.on('finish', () => {
                console.log('File written successfully!');
                resolve(true);
            });
            writeStream.on('error', (err) => {
                console.error('Error writing file:', err);
                reject(false);
            });
        });
        return status;
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

export async function completeFileUpload(uploadID,fileName) {
    const chunksFolderPath = path.join(__dirname, `/tmp/${uploadID}/chunks`);
    const outputFileName = path.join(__dirname, `/tmp/${uploadID}/${fileName}`);
    const filePath = await processFiles(chunksFolderPath, outputFileName, fileName, uploadID);
    return filePath;
}

async function processFiles(folderPath, outputFileName, fileName, uploadID) {
    try {
        // Read all file names in the folder
        let files = await fs.promises.readdir(folderPath);
        files = files.filter(file => /^\d+$/.test(file)) // Keep only files with numeric names
            .sort((a, b) => parseInt(a) - parseInt(b)); // Sort numerically

        const outputStream = createWriteStream(outputFileName);
        console.time("Total assembling Time");

        let count = 1;

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const fileBuffer = await fs.promises.readFile(filePath); 
            outputStream.write(fileBuffer);
            console.log(`File with id ${uploadID.split('=')[0]} has been assembled by ${(count/files.length*100).toFixed(2)}%`);
            count++;
        }
        outputStream.end();
        // Delete the original files
        await fs.promises.rm(folderPath, { recursive: true, force: true });

        console.timeEnd("Total assembling Time");

        const filePath = path.join(__dirname, `/tmp/${uploadID}/${fileName}`);
        return filePath;
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

