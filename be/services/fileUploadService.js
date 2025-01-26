import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
export async function uploadFile(chunk, formData) {
    const chunksFolderPath = path.join(__dirname, `/tmp/${formData['uploadKey']}/chunks`);
    const chunkFilePath = path.join(chunksFolderPath, `${formData['chunkIndex']}`);
    try {
        await fs.promises.mkdir(chunksFolderPath, { recursive: true });
        const writeStream = fs.createWriteStream(chunkFilePath);
        writeStream.write(chunk[0]);
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