import userControllers from "../controllers/user.js";

export const setUserRoutes = (app) => {
  // Log a user in and give them a token
  app.route("post", "/api/login", userControllers.userLogin);

  // Log a user out
  app.route("delete", "/api/logout", userControllers.userLogout);

  // Send user info
  app.route("get", "/api/user", userControllers.getuser);

  // Update a user info
  app.route("put", "/api/user", userControllers.updateUser);
};
