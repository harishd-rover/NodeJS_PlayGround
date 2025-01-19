import FFMPEG from "./ffmpeg.service.js";
import videoService from "../data/videos.service.js";
import fsPromises from "node:fs/promises";

class JobQueue {
  _jobs = [];
  _currentJob = null;

  constructor() {}

  enqueue(newJob) {
    this._jobs.push(newJob);
    console.log("Scheduled a new Job!!!");
    console.log(
      "Total Jobs: ",
      this._currentJob ? this._jobs.length + 1 : this._jobs.length,
      "Pending..."
    );
    this._executeNext();
  }

  _dequeue() {
    return this._jobs.shift();
  }

  _executeNext() {
    if (this._currentJob) {
      return;
    }
    const nextJob = this._dequeue();
    if (nextJob) {
      this._executeJob(nextJob);
    }
  }

  async _executeJob(job) {
    const { type } = job;
    this._currentJob = job;
    switch (type) {
      case "resize":
        await this._doResize(this._currentJob);
        break;

      default:
        break;
    }
    console.log("Finished a Job: ", this._jobs.length, "Pending...");
    this._currentJob = null;
    this._executeNext();
  }

  async _doResize(resizeJob) {
    const {
      videoId,
      originalVideoPath,
      vedioOutPath,
      width,
      height,
      dimension,
    } = resizeJob;

    try {
      // Resize vedio frm ffmpeg
      const status = await FFMPEG.createResizedVideo(
        originalVideoPath,
        vedioOutPath,
        width,
        height
      );

      if (status[0] !== 0) {
        throw new Error("Something went wrong.. while resizing!!!");
      }

      // update Db
      videoService.setResizeProcessing(videoId, dimension, false);
    } catch (error) {
      videoService.removeVideoResize(videoId, dimension);
      await fsPromises.rm(vedioOutPath);
      throw error;
    }
  }
}

export const jobQueue = new JobQueue();
