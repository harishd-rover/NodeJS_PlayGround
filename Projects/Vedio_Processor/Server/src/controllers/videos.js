import path from "node:path";
import crypto from "node:crypto";
import fsPromises from "node:fs/promises";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import videoService from "../data/videos.service.js";
import FFMPEG from "../services/ffmpeg.service.js";

const getVideos = async (req, res) => {
  const userId = req.userId;
  const videos = videoService.getVideosByUserId(userId);
  return res.status(200).json(videos);
};

const uploadVideo = async (req, res, handleError) => {
  const fileName = req.headers.filename;
  const filePath = path.parse(fileName);
  const videoId = crypto.randomBytes(4).toString("hex");
  const videoDirectory = `./fileSystem/${videoId}`;
  const videoPath = `./fileSystem/${videoId}/original${filePath.ext}`;
  const videoThumbnailPath = `./fileSystem/${videoId}/thumbnail.jpg`;
  try {
    //handle fileUpload
    await fsPromises.mkdir(videoDirectory);
    const fHandle = await fsPromises.open(videoPath, "w");
    const fWriteStream = fHandle.createWriteStream();
    await pipeline(req, fWriteStream);

    // get dimentions
    const videoDimension = FFMPEG.getVideoDimension(videoPath);

    // create thumbnail
    await FFMPEG.createThumbNail(videoPath, videoThumbnailPath);

    // update Database
    // create new video db object
    const videoDbo = new videoService.VideoDbo(
      videoId,
      filePath.name,
      filePath.ext.replace(".", ""),
      req.userId,
      false,
      {},
      videoDimension
    );

    // saving video object to db.
    videoService.saveVideo(videoDbo);

    res
      .status(200)
      .json({ status: "success", message: "File Uploaded successfully!!!" });
  } catch (error) {
    await fsPromises.rm(videoDirectory, { recursive: true });
    console.log("Error : ", error);
    return handleError();
  }
};

// get-video-asset?videoId=dca82db4&type=thumbnail
const getVedioAssets = async (req, res, handleError) => {
  const videoId = req.params.get("videoId");
  const assetType = req.params.get("type");
  let assetPath;
  try {
    switch (assetType) {
      case "thumbnail":
        assetPath = `./fileSystem/${videoId}/thumbnail.jpg`;
    }
    if (assetPath) {
      const fReadStream = fs.createReadStream(assetPath);
      await pipeline(fReadStream, res, { end: false });
    }
    res.end();
  } catch (error) {
    console.log("Error : ", error);
    return handleError();
  }
};

export default { getVideos, uploadVideo, getVedioAssets };
