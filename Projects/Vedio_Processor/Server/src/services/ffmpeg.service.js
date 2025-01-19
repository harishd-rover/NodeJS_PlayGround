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

    const videoProbeDuration = videoProbe.format.duration;

    const videoStream = videoProbe.streams.find(
      (stream) => stream.codec_type === "video"
    );

    const videoDimension = {
      width: videoStream.width,
      height: videoStream.height,
    };

    return {
      dimension: videoDimension,
      duration: videoStream.duration ?? videoProbeDuration,
    };
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

  //! Note :-  As we are scheduling this resize Processes. we have to make sure this process, A LOWER PRIORIRY PROCESS.
  //? NODE Should be our HIGHER PRIORITY PROCESS.
  //* By Increasing the NI(nice) value of the Process, so that reducing the priority of the process.
  //* or by Restricting the Resources for the Process by passing correct Resource/Thread/CPUs arguments.
  static async createResizedVideo(
    originalVideoPath,
    vedioOutputPath,
    width,
    height
  ) {
    //* Without Arg :[-thread 2] -> utilizes 60-65 Threads, 100% CPU => All CPU Cores.
    //* With    Arg :[-thread 2] -> utilizes 20-25 Threads, 20% CPU => 2 CPU Cores. Really Slow 😂
    const ffmpegChildProc = spawn("ffmpeg", [
      "-i",
      originalVideoPath,
      "-vf",
      `scale=${width}:${height}`,
      "-c:a",
      "copy",
      "-threads", // Important Here...
      "2",
      vedioOutputPath,
    ]);

    return await once(ffmpegChildProc, "close");
  }
}

export default FFMPEG;
