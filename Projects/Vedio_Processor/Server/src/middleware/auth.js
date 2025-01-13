import { extractToken } from "../services/cookies-token.service.js";
import usersService from "../data/users.service.js";
import { AUTH_COOKIE } from "../services/cookies-token.service.js";

const auth = (req, res, next) => {
  if (req.url.startsWith("/api") && !req.url.includes("/api/login")) {
    const authToken = req.cookies?.get(AUTH_COOKIE);
    if (authToken) {
      const [username, password] = extractToken(authToken);
      const validUser = usersService.validateUser(username, password);

      if (validUser) {
        req.userId = validUser.id;
        return next();
      } else {
        return res
          .status(401)
          .json({ error: "Invalid User, please login again" });
      }
    } else {
      return res
        .status(401)
        .json({ error: "Invalid User, please login again" });
    }
  }
  next();
};

export { auth as authenticate };
