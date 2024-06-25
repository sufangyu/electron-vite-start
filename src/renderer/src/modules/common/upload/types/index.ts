import { UploadRawFile } from 'element-plus';

export interface UploadFileItem extends UploadRawFile {
  url?: string;
}

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
