import { UploadFile, UploadFiles, UploadRawFile, UploadUserFile } from 'element-plus';
import { Awaitable } from 'element-plus/es/utils';

export interface UploadFileItem extends UploadRawFile {
  url?: string;
}

/**
 * 文件上传选择
 *
 * @export
 * @interface UploadOptions
 */
export interface UploadOptions {
  /**
   * 是否开启分片上传. 默认 true
   *
   * @type {boolean}
   * @memberof UploadOptions
   */
  multipart?: boolean;
  /**
   * 分片上传边界文件大小, 单位是 M. 默认 5M
   *
   * @type {number}
   * @memberof UploadOptions
   */
  chunkSizeLimit?: number;
  /**
   * 切片最大数. 默认 100
   *
   * @type {number}
   * @memberof UploadOptions
   */
  maxChunkCount?: number;
}

/**
 * chunk 文件信息
 *
 * @export
 * @interface ChunkFile
 */
export interface ChunkFile {
  file: Blob;
  filename: string;
}

/**
 * 文件上传 formdata
 *
 * @export
 * @interface UploadFormData
 * @extends {FormData}
 */
export interface UploadFormData extends FormData {
  append(name: 'file' | 'filename', value: string | Blob): void;
}

export interface SingleUploadReq extends UploadFormData {}

export interface MultipartUploadChunkReq extends UploadFormData {}

export interface MultipartUploadChunkRes {
  url: string;
}

/**
 * 文件状态
 *
 * @export
 * @enum {number}
 */
export enum FileStatus {
  待上传 = 'ready',
  上传中 = 'uploading',
  上传成功 = 'success',
  上传失败 = 'fail'
}

/**
 * 文件上传生命周期选择
 *
 * @export
 * @interface UploadLifeCycleOptions
 */
export interface UploadLifeCycleOptions {
  /**
   * 上传文件数量限制
   *
   * @type {number}
   * @memberof UploadLifeCycleOptions
   */
  limit?: number;
  /**
   * 上传文件大小限制, 单位 M
   *
   * @type {number}
   * @memberof UploadLifeCycleOptions
   */
  maxSize?: number;
  /**
   * 开启切片上传, 默认 true
   */
  multipart?: boolean;
  /**
   * 当超出限制时，执行的钩子函数
   *
   * @memberof UploadLifeCycleOptions
   */
  onExceed?: (files: File[], uploadFiles: UploadUserFile[]) => void;
  /**
   * 组件上传文件之前的钩子，参数为上传的文件。若返回false或者返回 Promise 且被 reject，则停止上传。
   *
   * @memberof UploadLifeCycleOptions
   */
  onBeforeUpload?: (
    rawFile: UploadRawFile
  ) => Awaitable<void | undefined | null | boolean | File | Blob>;
  /**
   * 文件上传成功时的钩子
   *
   * @memberof UploadLifeCycleOptions
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSuccess?: <T = Record<string, any>>(
    response: T,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ) => void;
  /**
   * 文件上传失败时的钩子
   *
   * @memberof UploadLifeCycleOptions
   */
  onError?: (error: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
  /**
   * 更新文件回调函数
   *
   * @memberof UploadOptions
   */
  updateFilesCallback: (uploadFile: UploadFile, uploadFiles: UploadFiles) => void;
}
