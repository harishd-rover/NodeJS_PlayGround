import { dbService } from "./database.service.js";

export const ASSET_TYPES = {
  ThumbNail: "thumbnail",
  Original: "original",
  Audio: "audio",
  Resize: "resize",
};

const SUPPORTED_VEDIO_FORMATS = new Set([
  ".mp4",
  ".mov",
  ".mkv",
  ".wmv",
  ".avi",
  ".webM",
]);

class VideoDbo {
  constructor(
    videoId,
    name,
    extension,
    userId,
    extractedAudio,
    resizes,
    dimensions,
    size,
    id = dbService.db.videos.length
  ) {
    this.id = id;
    this.videoId = videoId;
    this.name = name;
    this.extension = extension;
    this.userId = userId;
    this.extractedAudio = extractedAudio;
    this.resizes = resizes;
    this.dimensions = dimensions;
    this.size = size;
  }
}

const getVideosByUserId = (userId) => {
  return dbService.db.videos.filter((video) => video.userId === userId);
};

const saveVideo = (videoDbo) => {
  dbService.db.videos.unshift(videoDbo);
  dbService.db.updateVideos();
};

const getVideoDboByVideoId = (videoId) => {
  return dbService.db.videos.find((video) => video.videoId === videoId);
};

const setAudioExtracted = (videoId, isExtracted) => {
  if (videoId) {
    //* We can mutate the original array when using array.find() with objects
    const videoDbo = dbService.db.videos.find(
      (video) => video.videoId === videoId
    );
    videoDbo.extractedAudio = isExtracted;
    dbService.db.updateVideos();
  }
};

const setResizeProcessing = (videoId, dimension, isProcessing) => {
  if (videoId) {
    //* We can mutate the original array when using array.find() with objects
    const videoDbo = dbService.db.videos.find(
      (video) => video.videoId === videoId
    );
    videoDbo.resizes[`${dimension.width}x${dimension.height}`] = {
      processing: isProcessing,
    };
    dbService.db.updateVideos();
  }
};

const removeVideoResize = (videoId, dimension) => {
  if (videoId) {
    //* We can mutate the original array when using array.find() with objects
    const videoDbo = dbService.db.videos.find(
      (video) => video.videoId === videoId
    );
    delete videoDbo.resizes[`${dimension.width}x${dimension.height}`];
    dbService.db.updateVideos();
  }
};

const isVedioDimensionExists = (videoId, dimension) => {
  const videoDbo = dbService.db.videos.find(
    (video) => video.videoId === videoId
  );
  return !!videoDbo.resizes[`${dimension.width}x${dimension.height}`];
};

export default {
  VideoDbo,
  getVideosByUserId,
  saveVideo,
  getVideoDboByVideoId,
  SUPPORTED_VEDIO_FORMATS,
  setAudioExtracted,
  setResizeProcessing,
  removeVideoResize,
  isVedioDimensionExists,
};
