import { spawn } from "node:child_process";
import { once } from "node:events";

class FFMPEG {
  // ffmpeg/ffmprobe resolves the relative paths w.r.t cwd of the process.
  /**
   * get the video VideoStats
   * @param {string} videoPath
   * @returns VideoStats
   */
  static async getVideoStats(videoPath) {
    const ffmProbeChildProc = spawn(
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

    ffmProbeChildProc.stdout.setEncoding("utf-8");

    let ffmProbeOutput = "";
    for await (const string of ffmProbeChildProc.stdout) {
      ffmProbeOutput += string;
    }

    const videoProbe = JSON.parse(ffmProbeOutput);

    const videoStream = videoProbe.streams.find(
      (stream) => stream.codec_type === "video"
    );

    const videoDimension = {
      width: videoStream.width,
      height: videoStream.height,
    };

    return { dimension: videoDimension, duration: videoStream.duration };
  }

  static async createVideoThumbNail(videoPath, outputPath, frameTimingSec) {
    const ffmpegChildProc = spawn("ffmpeg", [
      "-i",
      videoPath,
      "-ss",
      frameTimingSec,
      "-vframes",
      1,
      outputPath,
    ]);

    return await once(ffmpegChildProc, "close");
  }

  static async createAudioFromVideo(originalVideoPath, audioOutPath) {
    const ffmpegChildProc = spawn("ffmpeg", [
      "-i",
      originalVideoPath,
      "-q:a",
      "0",
      "-map",
      "a",
      audioOutPath,
    ]);

    return await once(ffmpegChildProc, "close");
  }

  static async createResizedVideo(
    originalVideoPath,
    vedioOutputPath,
    width,
    height
  ) {
    const ffmpegChildProc = spawn("ffmpeg", [
      "-i",
      originalVideoPath,
      "-vf",
      `scale=${width}:${height}`,
      "-c:a",
      "copy",
      vedioOutputPath,
    ]);

    return await once(ffmpegChildProc, "close");
  }
}

export default FFMPEG;
