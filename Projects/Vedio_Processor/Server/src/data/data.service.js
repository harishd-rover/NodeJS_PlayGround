import { dbService } from "./database.service.js";

class User {
  constructor(id, name, username, password) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
  }
}

function getUserIndex(userId) {
  return dbService.db.users.findIndex((user) => user.id === userId);
}

function getUser(userId) {
  return dbService.db.users.find((user) => user.id === userId);
}

function getUserFromUserName(username) {
  return dbService.db.users.find((user) => user.username === username);
}

function validateUser(username, password) {
  return dbService.db.users.find(
    (user) => user.username === username && user.password === password
  );
}

function updateUser(userId, name, username, password) {
  const currentUser = getUser(userId);
  const modifiedUser = {
    ...currentUser,
    name: name || currentUser.name,
    username: username || currentUser.username,
    password: password || currentUser.password,
  };
  const currentUserIndex = getUserIndex(userId);

  dbService.db.users.splice(currentUserIndex, 1, modifiedUser);
  dbService.db.updateUsers();

  return new User(
    modifiedUser.id,
    modifiedUser.name,
    modifiedUser.username,
    modifiedUser.password
  );
}

export default {
  getUserIndex,
  getUser,
  getUserFromUserName,
  validateUser,
  updateUser,
};
