import dataService from "../data/data.service.js";
import { createToken, AUTH_COOKIE } from "../services/cookies-token.service.js";

const userLogin = (req, res) => {
  const { username, password } = req.body;
  const currentUser = dataService.getUserFromUserName(username);
  if (!currentUser) {
    res.status(401).json({ error: "Invalid Username" });
    return;
  }
  if (currentUser.password !== password) {
    res.status(401).json({ error: "Invalid Password" });
    return;
  }
  const authToken = createToken(currentUser.username, currentUser.password);
  res
    .setCookie(AUTH_COOKIE, authToken)
    .status(200)
    .json({ message: "Logged in!!!" });
};

const userLogout = (req, res) => {
  res.removeCookie(AUTH_COOKIE).status(200).json({ message: "Logged Out" });
};

const getuser = (req, res) => {
  const currentUser = dataService.getUser(req.userId);
  res.status(200).json({ ...currentUser, password: "*******" });
};

const updateUser = async (req, res) => {
  const modifiedUser = dataService.updateUser(
    req.userId,
    req.body.name,
    req.body.username,
    req.body.password
  );
  // update cookie
  const newToken = createToken(modifiedUser.username, modifiedUser.password);

  return res
    .setCookie(AUTH_COOKIE, newToken)
    .status(200)
    .json({ updatedUser: { ...modifiedUser, password: "*****" } });
};

export default { userLogin, userLogout, getuser, updateUser };
