import path from "node:path";
import crypto from "node:crypto";
import fsPromises from "node:fs/promises";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import videoService, { ASSET_TYPES } from "../data/videos.service.js";
import FFMPEG from "../services/ffmpeg.service.js";

const getVideos = async (req, res) => {
  const userId = req.userId;
  const videos = videoService.getVideosByUserId(userId);
  return res.status(200).json(videos);
};

const uploadVideo = async (req, res, handleError) => {
  const fileName = req.headers.filename;
  const filePath = path.parse(fileName);

  if (!videoService.SUPPORTED_VEDIO_FORMATS.has(filePath.ext)) {
    return handleError({
      status: 400,
      error: `Invalid File Format. Supported Video Formats (${videoService.SUPPORTED_VEDIO_FORMATS.values().reduce(
        (acc, curr) => acc + curr + " ",
        ""
      )})`,
    });
  }

  const fileSize = req.headers["content-length"];
  const videoId = crypto.randomBytes(4).toString("hex");
  const videoDirectory = `./fileSystem/${videoId}`;
  const videoPath = `./fileSystem/${videoId}/${ASSET_TYPES.Original}${filePath.ext}`;
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
    const videoThumbnailPath = `./fileSystem/${videoId}/${ASSET_TYPES.ThumbNail}.jpg`;
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
      filePath.ext,
      req.userId,
      false,
      {},
      videoDimension,
      fileSize
    );

    // saving video object to db.
    videoService.saveVideo(videoDbo);

    res
      .status(201)
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
  let assetPath, assetMimeType, assetSize;

  const videoDbo = videoService.getVideoDboByVideoId(videoId);

  try {
    switch (assetType) {
      case ASSET_TYPES.Original: {
        assetPath = `./fileSystem/${videoId}/${ASSET_TYPES.Original}${videoDbo.extension}`;
        assetSize = videoDbo.size;
        assetMimeType = `video/${videoDbo.extension.replace(".", "")}`;
        const downloadFileName = `${videoDbo.name}-original${videoDbo.extension}`;
        res.download(downloadFileName, assetSize, assetMimeType);
        break;
      }

      case ASSET_TYPES.ThumbNail: {
        assetPath = `./fileSystem/${videoId}/${ASSET_TYPES.ThumbNail}.jpg`;
        assetSize = (await fsPromises.stat(assetPath)).size;
        assetMimeType = "image/jpg";
        break;
      }

      case ASSET_TYPES.Audio: {
        assetPath = `./fileSystem/${videoId}/${ASSET_TYPES.Audio}.mp3`;
        assetSize = (await fsPromises.stat(assetPath)).size;
        assetMimeType = `audio/mp3`;
        const downloadFileName = `${videoDbo.name}-audio.mp3`;
        res.download(downloadFileName, assetSize, assetMimeType);
        break;
      }

      case ASSET_TYPES.Resize: {
        const dimension = req.params.get("dimensions");
        assetPath = `./fileSystem/${videoId}/${dimension}${videoDbo.extension}`;
        assetSize = (await fsPromises.stat(assetPath)).size;
        assetMimeType = `video/${videoDbo.extension.replace(".", "")}`;
        const downloadFileName = `${videoDbo.name}-${dimension}${videoDbo.extension}`;
        res.download(downloadFileName, assetSize, assetMimeType);
        break;
      }
    }

    if (assetPath) {
      res.justifyContent(assetMimeType, assetSize);
      const fReadStream = fs.createReadStream(assetPath);
      await pipeline(fReadStream, res);
    }
  } catch (error) {
    console.log("Error Handler : ", error);
    return handleError();
  }
};

export default { getVideos, uploadVideo, getVedioAssets };
