import {
  ElMessage,
  UploadRawFile,
  UploadUserFile,
  type UploadFile,
  type UploadFiles
} from 'element-plus';
import { Awaitable } from 'element-plus/es/utils';

import { UploadLifeCycleOptions } from '../types';

/**
 * 上传生命周期 Hooks
 *
 * @export
 * @param {UploadLifeCycleOptions} [options]
 * @return {*}
 */
export function useUploadLifeCycle(options?: UploadLifeCycleOptions) {
  /**
   * 组件当超出限制时，执行的钩子函数
   *
   * @param {File[]} files
   * @param {UploadUserFile[]} uploadFiles
   */
  const handleExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
    if (typeof options?.onExceed === 'function') {
      options?.onExceed(files, uploadFiles);
    } else {
      const message = `最多上传 ${options?.limit} 个文件，本次选择了 ${files.length} 个文件`;
      ElMessage.warning({ message, grouping: true });
    }
  };

  /**
   * 组件上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传。
   *
   * @param {UploadRawFile} rawFile
   * @return {*}  {(Awaitable<void | undefined | null | boolean | File | Blob>)}
   */
  const handleBeforeUpload = (
    rawFile: UploadRawFile
  ): Awaitable<void | undefined | null | boolean | File | Blob> => {
    if (typeof options?.onBeforeUpload === 'function') {
      return options?.onBeforeUpload(rawFile);
    } else {
      const { size } = rawFile;
      if (!options?.multipart && size > (options?.maxSize ?? 0) * 1024 * 1024) {
        ElMessage.error({ message: `上传文件不能超过 ${options?.maxSize} M`, grouping: true });
        return false;
      }

      return true;
    }
  };

  /**
   * 组件文件上传成功时的钩子
   *
   * @template T
   * @param {*} [response=T]
   * @param {UploadFile} uploadFile
   * @param {UploadFiles} uploadFiles
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUploadSuccess = <T = Record<string, any>>(
    response: T,
    uploadFile: UploadFile,
    uploadFiles: UploadFiles
  ) => {
    if (typeof options?.onSuccess === 'function') {
      options?.onSuccess(response, uploadFile, uploadFiles);
    } else {
      typeof options?.updateFilesCallback === 'function' &&
        options?.updateFilesCallback(uploadFile, uploadFiles);
    }
  };

  /**
   * 组件文件上传失败时的钩子
   *
   * @param {Error} err
   * @param {UploadFile} uploadFile
   * @param {UploadFiles} uploadFiles
   */
  const handleUploadError = (err: Error, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    if (typeof options?.onError === 'function') {
      options?.onError(err, uploadFile, uploadFiles);
    }
  };

  /**
   * 组件文件列表移除文件时的钩子
   *
   * @param {UploadFile} uploadFile
   * @param {UploadFiles} uploadFiles
   */
  const handleRemove = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    typeof options?.updateFilesCallback === 'function' &&
      options?.updateFilesCallback(uploadFile, uploadFiles);
  };

  return {
    handleExceed,
    handleBeforeUpload,
    handleUploadSuccess,
    handleUploadError,
    handleRemove
  };
}
