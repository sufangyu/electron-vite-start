import path from 'path';
import { existsSync } from 'fs';
import { BrowserWindow } from 'electron';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffprobePath from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import { IpcData, VideoCompressOptions } from '@share/types';
import { FILE_IPC_CHANNEL_EVENT, VEDIO_IPC_CHANNEL, VEDIO_IPC_CHANNEL_EVENT } from '@share/event';
import { events, windowPool } from '@share/utils';
import { getBuildPath } from '../../utils/index';

/** 进度信息 */
interface Progress {
  frames: number;
  currentFps: number;
  currentKbps: number;
  targetSize: number;
  timemark: string;
  percent: number;
}

/**
 * 压缩状态
 */
enum STATE {
  /** 准备状态, 等待开始压缩 */
  READY = 'ready',
  /** 开始压缩 */
  COMPRESS = 'compress',
  /** 压缩完成 */
  FINISHED = 'finished',
  /** 压缩出错 */
  ERROR = 'error',
  /** 暂停压缩 */
  PAUSE = 'pause'
}

ffmpeg.setFfmpegPath(getBuildPath(ffmpegPath.path));
ffmpeg.setFfprobePath(getBuildPath(ffprobePath.path));

export default class FfmpegController {
  ffmpeg: ffmpeg.FfmpegCommand;
  // 事件来源窗口
  private window: BrowserWindow | null;

  /**
   * 状态
   *
   * @private
   * @type {STATE}
   * @memberof Ffmpeg
   */
  private state: STATE;

  constructor(
    private win: BrowserWindow,
    private options: VideoCompressOptions
  ) {
    this.ffmpeg = ffmpeg(this.options.file.path);
    this.window = this.win!;
    this.state = STATE.READY;
  }

  // 监听进度事件. 通过通讯传递进度值给渲染进程
  private onProgress(progress: Progress) {
    const curProgress: number = progress?.percent ?? 0;
    this.handleResult(VEDIO_IPC_CHANNEL_EVENT.PROGRESS, {
      message: '压缩中',
      detail: curProgress
    });
  }

  private onError(err) {
    console.log('An error occurred: ' + err.message);

    this.handleResult(VEDIO_IPC_CHANNEL_EVENT.ERROR, {
      message: '压缩错误',
      detail: err
    });
    this.state = STATE.ERROR;
  }

  // 监听完成事件, 通过通讯传递结果给渲染进程
  private onEnd() {
    this.handleResult(VEDIO_IPC_CHANNEL_EVENT.FINISHED, {
      message: '压缩完成',
      detail: null
    });
    this.state = STATE.FINISHED;
  }

  /**
   * 获取保存的文件完整路径
   *
   * @private
   * @return {*} 返回保存的文件路径
   * @memberof Ffmpeg
   */
  private getSaveFileFullPath() {
    const {
      fps,
      size,
      file,
      saveDirectory,
      saveFileNameOptions = {
        size: true,
        fps: true
      }
    } = this.options;

    const fileInfo = path.parse(file.path);
    const saveFilePath = path.join(
      saveDirectory,
      [
        fileInfo.name, // 文件名
        saveFileNameOptions.size ? `-${size}` : '',
        saveFileNameOptions.fps ? `-${fps}` : '',
        fileInfo.ext // 文件格式
      ].join('')
    );
    return saveFilePath;
  }

  /**
   * 校验
   *
   * @private
   * @return {*}  {boolean}
   */
  private validate(): boolean {
    // 判断是否存在目录
    if (!existsSync(this.options.saveDirectory)) {
      this.handleResult(FILE_IPC_CHANNEL_EVENT.DIRECTORY_EXISTS, {
        message: '压缩失败',
        detail: '保存目录不存在'
      });
      return false;
    }
    // 判断文件是否存在
    const fileFullPath = this.getSaveFileFullPath();
    if (existsSync(fileFullPath)) {
      this.handleResult(FILE_IPC_CHANNEL_EVENT.FILE_EXISTS, {
        message: '压缩失败',
        detail: '压缩视频已存在'
      });
      return false;
    }
    return true;
  }

  /**
   * 执行压缩
   *
   * @return {*}
   * @memberof Ffmpeg
   */
  run() {
    if (!this.validate()) {
      return;
    }

    const { fps, size } = this.options;
    const saveFileFullPath = this.getSaveFileFullPath();
    this.ffmpeg
      .videoCodec('libx264')
      .fps(fps)
      .size(size)
      // TODO: 支持压缩指定文件格式
      .format('mp4')
      .on('progress', (progress) => this.onProgress(progress))
      .on('error', (err) => this.onError(err))
      .on('end', () => this.onEnd())
      .save(saveFileFullPath);

    this.state = STATE.COMPRESS;
  }

  /**
   * 暂停压缩
   *
   * @return {*}
   * @memberof Ffmpeg
   */
  pause() {
    if (this.state !== STATE.COMPRESS) {
      return;
    }

    this.state = STATE.PAUSE;
    this.ffmpeg?.kill('SIGKILL');
    this.handleResult(VEDIO_IPC_CHANNEL_EVENT.PAUSE, {
      message: '暂停压缩',
      detail: null
    });
  }

  /**
   * 继续压缩
   *
   * @memberof Ffmpeg
   */
  continue() {
    if ([STATE.PAUSE, STATE.ERROR].includes(this.state)) {
      this.state = STATE.COMPRESS;
      this.ffmpeg?.run();
    }
  }

  /**
   * 更新渲染进程更新过程
   *
   * @private
   * @param {(VEDIO_IPC_CHANNEL_EVENT | FILE_IPC_CHANNEL_EVENT)} event 事件
   * @param {IpcData} data 通讯传输数据
   * @memberof Ffmpeg
   */
  private handleResult(event: VEDIO_IPC_CHANNEL_EVENT | FILE_IPC_CHANNEL_EVENT, data: IpcData) {
    const curWindowName = windowPool.getName(Number(this.window?.id));
    events?.emitTo(curWindowName!, VEDIO_IPC_CHANNEL, { event, data });
  }
}
