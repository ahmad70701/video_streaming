import { Schema, model } from 'mongoose';

const videoSchema = Schema({
    title: { type: String, required: true, unique: true },
    description:{type: String},
    tags: { type: [String] },
    fileUrl: { type: String },
}, { timestamps: true });

export default model('Video', videoSchema);
