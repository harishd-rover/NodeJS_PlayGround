import videoController from "../controllers/videos.js";

export const setVideoRoutes = (app) => {
  // get Videos
  app.route("get", "/api/videos", videoController.getVideos);
};
