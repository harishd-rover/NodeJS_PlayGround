import videoController from "../controllers/videos.js";

export const setVideoRoutes = (app) => {
  // upload videos
  app.route("post", "/api/upload-video", videoController.uploadVideo);
  // get user Videos
  app.route("get", "/api/videos", videoController.getVideos);
  // GET get-video-asset?videoId=dca82db4&type=thumbnail
  app.route("get", "/get-video-asset", videoController.getVedioAssets);
};
