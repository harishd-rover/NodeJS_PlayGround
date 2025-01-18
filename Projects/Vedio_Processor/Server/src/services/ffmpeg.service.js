import { spawnSync, spawn } from "node:child_process";
import { once } from "node:events";

class FFMPEG {
  // ffmpeg/ffmprobe resolves the relative paths w.r.t cwd of the process.
  /**
   * get the video dimensions
   * @param {string} videoPath
   * @returns Dimension {width:number,height:number}
   */
  static getVideoDimension(videoPath) {
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

    return videoDimension;
  }

  static async createThumbNail(videoPath, outputPath) {
    const ffmpegChildProc = spawn("ffmpeg", [
      "-i",
      videoPath,
      "-ss",
      5,
      "-vframes",
      1,
      outputPath,
    ]);

    await once(ffmpegChildProc, "close");
  }
}

export default FFMPEG;
