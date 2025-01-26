export async function multiPartParser(req,res,next){
    try {
        const boundary = req.headers['content-type'].split('boundary=')[1];
        const boundaryBuffer = Buffer.from('\r\n'+boundary + '--\r\n');
        const parts = req.body.toString("utf8").split('--' + boundary);
        const fileData = [];
        const formData = {};
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
                fileData.push(req.body.slice(index,(req.body.length - boundaryBuffer.length-2)))
            }
        });
        req.file = fileData;
        req.form = formData;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
}