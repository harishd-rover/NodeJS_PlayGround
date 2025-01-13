import fs from "node:fs";
import path from "node:path";

const usersPath = path.resolve(import.meta.dirname, "../../database/users");
const sessionsPath = path.resolve(
  import.meta.dirname,
  "../../database/sessions"
);
const videosPath = path.resolve(import.meta.dirname, "../../database/videos");

class DBService {
  _dbInstance;
  _users;
  _sessions;
  _vedios;
  constructor() {
    this._users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    this._sessions = JSON.parse(fs.readFileSync(sessionsPath, "utf-8"));
    this._vedios = JSON.parse(fs.readFileSync(videosPath, "utf-8"));
  }

  get users() {
    return this._users;
  }

  get sessions() {
    return this._sessions;
  }

  get videos() {
    return this._vedios;
  }

  /**
   *
   * @param {Function:(users)=>updatedUsers} cb callBack function
   */
  updateUsers(cb) {
    if (cb) {
      this._users = cb(this._users);
    }
    fs.writeFileSync(usersPath, JSON.stringify(this._users));
  }

  /**
   *
   * @param {Function:(sessions)=>updatedSessions} cb callBack function
   */
  updateSessions(cb) {
    if (cb) {
      this._sessions = cb(this._sessions);
    }
    fs.writeFileSync(sessionsPath, JSON.stringify(this._sessions));
  }

  updateVideos(cb) {
    if (cb) {
      this._vedios = cb(this._vedios);
    }
    fs.writeFileSync(videosPath, JSON.stringify(this._vedios));
  }

  static get db() {
    if (this._dbInstance) {
      return this._dbInstance;
    } else {
      this._dbInstance = new DBService();
      return this._dbInstance;
    }
  }
}

export { DBService as dbService };
