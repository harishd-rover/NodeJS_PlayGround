import videoController from "../controllers/videos.js";

export const setVideoRoutes = (app) => {
  // upload videos
  app.route("post", "/api/upload-video", videoController.uploadVideo);
  // get user Videos
  app.route("get", "/api/videos", videoController.getVideos);
};
