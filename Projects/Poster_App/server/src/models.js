export class Post {
  constructor(id, title, body, userId) {
    this.id = id;
    this.body = body;
    this.title = title;
    this.userId = userId;
  }
}

export class User {
  constructor(id, username, password, name) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
  }
}
