import { posts, users } from "./model.data.js";
import { Post } from "./models.js";

export function getAllPosts() {
  return posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id == post.userId).name,
  }));
}

export function getUserIndex(userId) {
  return users.findIndex((user) => user.id === userId);
}

export function getUser(userId) {
  return users.find((user) => user.id === userId);
}

export function getUserFromUserName(username) {
  return users.find((user) => user.username === username);
}

export function validateUser(username, password) {
  return users.find(
    (user) => user.username === username && user.password === password
  );
}

export function createPost(userId, title, body) {
  const newPost = new Post(Date.now(), title, body, userId);
  posts.unshift(newPost);
  return newPost;
}

export function updateUser(userId, name, username, password) {
  const currentUser = getUser(userId);
  const modifiedUser = {
    ...currentUser,
    name: name || currentUser.name,
    username: username || currentUser.username,
    password: password || currentUser.password,
  };
  const currentUserIndex = getUserIndex(userId);
  users.splice(currentUserIndex, 1, modifiedUser);
  return modifiedUser;
}
