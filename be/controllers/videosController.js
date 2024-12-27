import { get } from "mongoose";
import Video from "../models/videos.js";

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
    if (req.file) {
        console.log(req.headers['file-name']);
    }
    res.status(200).send(req.file.path);
}
  

  