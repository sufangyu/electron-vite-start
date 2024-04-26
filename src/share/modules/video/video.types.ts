/**
 * 视频状态
 */
export enum VIDEO_STATE {
  /** 准备 */
  READY = 'ready',
  /** 压缩 */
  COMPRESS = 'compress',
  /** 完成 */
  FINISHED = 'finished',
  /** 错误 */
  ERROR = 'error'
}

/**
 * 压缩配置
 *
 * @export
 * @interface VideoCompressOptions
 */
export interface VideoCompressOptions {
  /** 窗口名称 */
  windowName: string;
  /** 文件信息 */
  file: Video;
  /** 帧数 */
  fps: number;
  /** 分辨率 */
  size: string;
  /** 保存目录 */
  saveDirectory: string;
  // 保存文件名配置
  saveFileNameOptions?: {
    size: boolean;
    fps: boolean;
  };
}

/**
 * 视频信息
 *
 * @export
 * @interface Video
 */
export interface Video {
  /** 视频名称 */
  name: string;
  /** 视频文件路径 */
  path: string;
  /** 转换进度 */
  progress?: number;
  /** 状态 */
  state?: VIDEO_STATE;
}
