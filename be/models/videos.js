import { Schema, model } from 'mongoose';

const videoSchema = Schema({
    title: { type: String, required: true, unique: true },
    description:{type: String},
    tags: { type: [String] },
    status : {type: String},
    fileUrl: { type: [ String ] },
}, { timestamps: true });

const Video = model('Video', videoSchema);

export async function getOneVideo(_id) {
    return await Video.findOne({ _id });
}

export async function getAllVideos() {
    return await Video.find();
}

export async function changeVideoStatus(id,status) {
    await Video.findByIdAndUpdate(id, {
        status: status
    });
}

export async function addVideoURLs(id,streamUrl) {
    await Video.findByIdAndUpdate(id, {
        $push: { fileUrl: streamUrl },
      });
} 

export async function addVideoToDB(title,tags,description) {
    const existingVideo = await Video.findOne({ title: title });
    if (existingVideo) return false;
    const video = new Video({
        title: title,
        tags: tags,
        description: description,
        fileUrl: [],
    });
    const savedVideo = await video.save();
    return savedVideo._id.toString();
}

export async function deleteVideoFromDB(_id) {
    return await Video.deleteOne({ _id });
}
