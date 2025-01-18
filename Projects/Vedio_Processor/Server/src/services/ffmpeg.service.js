import { spawnSync, spawn } from "node:child_process";
import { once } from "node:events";

class FFMPEG {
  // ffmpeg/ffmprobe resolves the relative paths w.r.t cwd of the process.
  /**
   * get the video VideoStats
   * @param {string} videoPath
   * @returns VideoStats
   */
  static getVideoStats(videoPath) {
    const buffer = spawnSync(
      "ffprobe",
      [
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        videoPath,
      ]
      // { cwd: process.cwd() } // by default takes parent process cwd.
    );
    const videoProbe = JSON.parse(buffer.stdout.toString());

    const videoStream = videoProbe.streams.find(
      (stream) => stream.codec_type === "video"
    );

    const videoDimension = {
      width: videoStream.width,
      height: videoStream.height,
    };

    return { dimension: videoDimension, duration: videoStream.duration };
  }

  static async createThumbNail(videoPath, outputPath, frameTimingSec) {
    const ffmpegChildProc = spawn("ffmpeg", [
      "-i",
      videoPath,
      "-ss",
      frameTimingSec,
      "-vframes",
      1,
      outputPath,
    ]);

    await once(ffmpegChildProc, "close");
  }
}

export default FFMPEG;
