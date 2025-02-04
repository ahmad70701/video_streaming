// export async function multiPartParser(req,res,next){
//     try {
//         const boundary = req.headers['content-type'].split('boundary=')[1];
//         const boundaryBuffer = Buffer.from('\r\n' + boundary + '--\r\n');
//         const boundaryBufferForSplitting = Buffer.from('--' + boundary);
//         console.log(boundaryBufferForSplitting);
//         const parts = req.body.toString("utf8").split('--' + boundary);
//         const fileData = [];
//         const formData = {};
//         parts.forEach(part => {
//             //formdata
//             if (part.includes('Content-Disposition')&&!part.includes('filename')) {
//                 let [key,value] = part.split('Content-Disposition: ')[1].split('form-data; name=')[1].split('\r\n\r\n');
//                 formData[key.replace(/^"|"$/g, '')] = value.trim();
//             }
//             //fileData
//             else if(part.includes('Content-Disposition') && part.includes('filename')) {
//                 let [key, value] = part.split('Content-Disposition: ')[1].split('form-data; name=')[1].split('\r\n\r\n');
//                 let bufferToIndex = Buffer.from(key + '\r\n\r\n');
//                 let index = req.body.indexOf(bufferToIndex)+ bufferToIndex.length
//                 fileData.push(req.body.slice(index,(req.body.length - boundaryBuffer.length-2)))
//             }
//         });
//         req.file = fileData;
//         req.form = formData;

//         next();
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: error.message });
//     }
// }

import busboy from 'busboy';

export function multiPartParser(req, res, next) {
    try {
        const bb = busboy({ headers: req.headers });

        const fileData = [];
        const formData = {};
        let buffer = 0;

        bb.on('field', (fieldname, val) => {
            formData[fieldname] = val;
        });

        bb.on('file', (fieldname, file, filename, encoding, mimetype) => {
            const chunks = [];

            file.on('data', (chunk) => {
                chunks.push(chunk);
            }).on('close', () => {
                fileData.push({
                    fieldname,
                    filename,
                    encoding,
                    mimetype,
                    buffer: Buffer.concat(chunks)
                });
                buffer = Buffer.concat(chunks);
            });
        });

        bb.on('close', () => {
            req.file = fileData;
            req.form = formData;
            next();
        });

        req.pipe(bb);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}


/*
------WebKitFormBoundary7O2dAwAiftWf4GW0
Content-Disposition: form-data; name="uploadKey"

679d361b230a184ab55d8011=46a8c133-b53b-431a-960f-4a2a504f477d
------WebKitFormBoundary7O2dAwAiftWf4GW0
Content-Disposition: form-data; name="fileName"

dolby-conductor-(www.demolandia.net).mkv
------WebKitFormBoundary7O2dAwAiftWf4GW0
Content-Disposition: form-data; name="chunkIndex"

1
------WebKitFormBoundary7O2dAwAiftWf4GW0
Content-Disposition: form-data; name="totalChunks"

4
------WebKitFormBoundary7O2dAwAiftWf4GW0
Content-Disposition: form-data; name="chunk"; filename="blob"
Content-Type: application/octet-stream

×÷æÊ<data goes here>
------WebKitFormBoundary7O2dAwAiftWf4GW0--
*/