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

export default {
  VideoDbo,
  getVideosByUserId,
  saveVideo,
  getVideoDboByVideoId,
  SUPPORTED_VEDIO_FORMATS,
};
