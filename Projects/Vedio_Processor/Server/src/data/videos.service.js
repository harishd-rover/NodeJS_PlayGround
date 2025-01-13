import { dbService } from "./database.service.js";

class VideoDbo {
  constructor(
    videoId,
    name,
    extension,
    userId,
    extractedAudio,
    resizes,
    dimensions,
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
  }
}

const getVideosByUserId = (userId) => {
  return dbService.db.videos.filter((video) => video.userId === userId);
};

const saveVideo = (videoDbo) => {
  dbService.db.videos.unshift(videoDbo);
  dbService.db.updateVideos();
};

export default { VideoDbo, getVideosByUserId, saveVideo };
