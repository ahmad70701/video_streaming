import { Schema, model } from 'mongoose';

const videoSchema = Schema({
    _id :{type:String},
    title: { type: String, required: true },
    description:{type: String},
    tags: { type: [String] },
    fileUrl: { type: String, required: true },
}, { timestamps: true });

export default model('Video', videoSchema);
