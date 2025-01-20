const BASE_URL = window.location.origin;

fetch(`${BASE_URL}/api/auth/authenticate/`)
  .then((response) => {
    if (response.status === 401) {
      login.textContent = "Login/Signup";
      login.href = 'login.html';
      upload.href = 'login.html';
      console.log(response.status);
    } else if (response.status === 200) {
      login.textContent = "Logout";
      login.href = "#";
      login.setAttribute('onclick', "logout()");
      upload.href = 'upload.html';
    }
    nav.classList.remove('hidden');
    return response.json();
  })
  .then((data) => {
      console.log(data);
  })
  .catch((error) => console.error('Error fetching response!', error));

async function logout() {
const response = await fetch(`${BASE_URL}/api/auth/logout/`, {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    },
});

if (response.ok) {
    window.location.href = '/login.html';
} else {
    console.error('Logout failed');
}
}

document.getElementById("uploadBtn").addEventListener('click',initUpload);

 async function initUpload(e){
    e.preventDefault();
    const title = document.getElementById("title").value;
    const fileTags = document.getElementById("tags").value;
    const description = document.getElementById("description").value;
    const data = {"title":title,
        "tags":fileTags,
        "description":description
    }
    try {
        const response = await fetch(`${BASE_URL}/api/videos`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        await uploadFileInChunks(result);
    } catch (error) {
        console.error('Error while sending data:', error);
    }   
}
async function uploadFileInChunks(key){
    const startTime = new Date();

    const uploadKey = key.uploadKey
    // console.log('Response from server:', uploadKey);
    const file = document.getElementById('video').files[0];
    const progressBar = document.getElementById('progress');
    const progressText = document.getElementById('progressText');
    const message = document.getElementById('message');
  
    const fileName = file.name;
    const fileSize = file.size;
    const chunkSize = 1024*1024 //50MB
    const lastChunkSize = fileSize%chunkSize;
    const totalChunks = Math.floor(fileSize/chunkSize)+(lastChunkSize>0?1:0);
    console.log(`total chunks are: ${totalChunks} of file of size ${fileSize} in bytes`)
    let uploadedChunks=0;
    const fetchReqArray = [];
    let progress = 0;
    let start = 0 , end;
    for(let chunkIndex=0;chunkIndex<totalChunks;chunkIndex++){
        end = start+chunkSize;
        const chunk = file.slice(start,end);
        const formData = new FormData();
        formData.append('uploadKey',uploadKey);
        formData.append('fileName',fileName);
        formData.append('chunkIndex',chunkIndex);
        formData.append('totalChunks',totalChunks);
        formData.append('chunk',chunk);
      
        const req = fetch(`${BASE_URL}/api/videos/upload`,{
            method:'POST',
            body:formData
        }).then(response=>{
            if (!response.ok) {
            throw new Error(`Chunk ${chunkIndex} upload failed with status: ${response.status}`);
            }
            uploadedChunks++;
            progress = Math.floor(uploadedChunks / totalChunks * 100);
            progressBar.value = progress;
            progressText.innerHTML = progress;
          
            console.log(`uploaded chunk number ${chunkIndex} TOTALCHUNKS: ${totalChunks} UPLOADEDCHUNKS: ${uploadedChunks} PROGRESS: ${progress}`)
            return response.json();
        });
        fetchReqArray.push(req);
        start = end;
    }
    if(lastChunkSize>0){
        end = start+lastChunkSize
        const chunk = file.slice(start,end);
        const formData = new FormData();
        formData.append('uploadKey',uploadKey);
        formData.append('fileName',fileName);
        formData.append('chunkIndex',totalChunks-1);
        formData.append('totalChunks',totalChunks);
        formData.append('chunk',chunk);

        const req = fetch(`${BASE_URL}/api/videos/upload`,{
            method:'POST',
            body:formData
        }).then(response=>{
            if (!response.ok) {
            throw new Error(`Chunk ${chunkIndex} upload failed with status: ${response.status}`);
            }
            uploadedChunks++;
            progress = Math.floor(uploadedChunks / totalChunks * 100);
            progressBar.value = progress;
            progressText.innerHTML = progress;
            console.log(`uploaded chunk number ${chunkIndex} TOTALCHUNKS: ${totalChunks} UPLOADEDCHUNKS: ${uploadedChunks} PROGRESS: ${progress}`)
            return response.json();
        });
        fetchReqArray.push(req);
    }
    try {
        const results = await Promise.allSettled(fetchReqArray);
        const successfulResponses = results
            .filter(result => result.status === 'fulfilled' && result.value !== null)
            .map(result => result.value);

            console.log('Successfully uploaded chunks:', successfulResponses);
            if(successfulResponses.length == totalChunks){
                try {
                const response = await fetch(`${BASE_URL}/api/videos/completeUpload`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({'uploadID':uploadKey,
                    'fileName':fileName
                })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                
                } catch (error) {
                    console.error('Error while sending data:', error);
                } 
            }
        const endTime = new Date();
        const elapsedTime = (endTime-startTime)/1000
        message.innerHTML = `Upload process completed in ${elapsedTime} seconds`;
        console.log(`Upload process completed in ${elapsedTime} seconds`);
        message.classList.remove("hidden");
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 2000);

    } catch (error) {
        console.error('Error during chunk uploads:', error);
    }
}

