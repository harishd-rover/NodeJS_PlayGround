import FFMPEG from "./ffmpeg.service.js";
import videoService, { ASSET_TYPES } from "../data/videos.service.js";
import fsPromises from "node:fs/promises";
import cluster from "node:cluster";

export class JobQueue {
  _jobQueueInstance = null;
  _jobs = [];
  _currentJob = null;

  constructor() {
    // Get pending jobs.
    const pendingJobs = videoService.getPendingResizeJobs();
    console.log("Pending Jobs: ", pendingJobs);

    // Resume the pending/un-successfull resizes.
    pendingJobs.forEach((job) => {
      this.enqueue(job);
    });
  }

  enqueue(newJob) {
    this._jobs.push(newJob);
    console.log(
      "Scheduled a new job. : ",
      this._currentJob ? this._jobs.length + 1 : this._jobs.length,
      "Jobs in a Queue..."
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
    console.log("Finished a Job: ", this._jobs.length, "Jobs Pending...");
    this._currentJob = null;
    this._executeNext();
  }

  async _doResize(resizeJob) {
    const { videoId, dimension } = resizeJob;
    const { width, height } = dimension;
    const str_dimension = `${width}x${height}`;
    const videoDbo = videoService.getVideoDboByVideoId(videoId);
    const originalVideoPath = `./fileSystem/${videoId}/${ASSET_TYPES.Original}${videoDbo.extension}`;
    const vedioOutPath = `./fileSystem/${videoId}/${str_dimension}${videoDbo.extension}`;

    // Unlink if any unprocessed resize file existing in target location
    await this._unLinkUnProcessedFile(vedioOutPath);

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

  async _unLinkUnProcessedFile(path) {
    try {
      await fsPromises.rm(path);
    } catch (error) {}
  }

  static get Queue() {
    if (this._jobQueueInstance) {
      return this._jobQueueInstance;
    } else {
      this._jobQueueInstance = new JobQueue();
      return this._jobQueueInstance;
    }
  }
}

// If Not in Cluster Mode.
// Here create an Instance to start Pending Jobs.
if (cluster.isPrimary) {
  JobQueue.Queue;
}
