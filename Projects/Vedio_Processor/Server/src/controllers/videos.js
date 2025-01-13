import path from "node:path";
import crypto from "node:crypto";
import fsPromises from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import videoService from "../data/videos.service.js";

const getVideos = async (req, res) => {
  const userId = req.userId;
  const videos = videoService.getVideosByUserId(userId);
  return res.status(200).json(videos);
};

const uploadVideo = async (req, res, handleError) => {
  const fileName = req.headers.filename;
  const parsedPath = path.parse(fileName);
  const videoId = crypto.randomBytes(4).toString("hex");
  const videoDirectory = `./fileSystem/${videoId}`;
  const videoPath = `./fileSystem/${videoId}/original${parsedPath.ext}`;
  try {
    //handle fileUpload
    await fsPromises.mkdir(videoDirectory);
    const fHandle = await fsPromises.open(videoPath, "w");
    const fWriteStream = fHandle.createWriteStream();
    await pipeline(req, fWriteStream);

    // update Database
    // create new video db object
    const videoDbo = new videoService.VideoDbo(
      videoId,
      parsedPath.name,
      parsedPath.ext.replace(".", ""),
      req.userId,
      false,
      {},
      { width: 1400, height: 900 }
    );

    // saving video object to db.
    videoService.saveVideo(videoDbo);

    res.status(200).json({ success: true });
  } catch (error) {
    await fsPromises.rm(videoDirectory, { recursive: true });
    console.log(error);
    return handleError();
  }
};

export default { getVideos, uploadVideo };
