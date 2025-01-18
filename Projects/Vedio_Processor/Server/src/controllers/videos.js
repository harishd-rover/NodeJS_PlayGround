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
  const fileSize = req.headers["content-length"];
  const filePath = path.parse(fileName);
  const videoId = crypto.randomBytes(4).toString("hex");
  const videoDirectory = `./fileSystem/${videoId}`;
  const videoPath = `./fileSystem/${videoId}/original${filePath.ext}`;
  try {
    //handle fileUpload
    await fsPromises.mkdir(videoDirectory);
    const fHandle = await fsPromises.open(videoPath, "w");
    const fWriteStream = fHandle.createWriteStream();
    await pipeline(req, fWriteStream);

    // get dimentions to save in DB.
    const videoStats = await FFMPEG.getVideoStats(videoPath);
    const videoDimension = videoStats.dimension;

    // create a thumbnail from a random Video frame
    const videoThumbnailPath = `./fileSystem/${videoId}/thumbnail.jpg`;
    const videoDuration = videoStats.duration;
    const randFrameTiming =
      Math.floor(Math.random() * Math.floor(videoDuration)) + 1;

    await FFMPEG.createVideoThumbNail(
      videoPath,
      videoThumbnailPath,
      randFrameTiming
    );

    // update Database

    const videoDbo = new videoService.VideoDbo( // create new video db object
      videoId,
      filePath.name,
      filePath.ext.replace(".", ""),
      req.userId,
      false,
      {},
      videoDimension,
      fileSize
    );

    // saving video object to db.
    videoService.saveVideo(videoDbo);

    res
      .status(200)
      .json({ status: "success", message: "File Uploaded successfully!!!" });
  } catch (error) {
    await fsPromises.rm(videoDirectory, { recursive: true });
    console.log("Error Handler : ", error);
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
        break;
      case "original":
        const videoDbo = videoService.getVideoDboByVideoId(videoId);
        assetPath = `./fileSystem/${videoId}/original.${videoDbo.extension}`;
        const downloadFileName = `${videoId}-original.${videoDbo.extension}`;
        res.download(downloadFileName, videoDbo.size);
        break;
    }
    if (assetPath) {
      const fReadStream = fs.createReadStream(assetPath);
      await pipeline(fReadStream, res);
    }
  } catch (error) {
    console.log("Error Handler : ", error);
    return handleError();
  }
};

export default { getVideos, uploadVideo, getVedioAssets };
