export interface MultipartUploadConfig {
  /**
   * 分片上传边界大小. 默认 5M
   *
   * @type {number}
   * @memberof MultipartUploadConfig
   */
  maxSize?: number;

  /**
   * 切片最大数. 默认 100
   *
   * @type {number}
   * @memberof MultipartUploadConfig
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
