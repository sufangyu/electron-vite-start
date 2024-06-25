/* eslint-disable no-async-promise-executor */

import {
  ElMessage,
  type UploadRequestHandler,
  type UploadFile,
  type UploadRequestOptions,
  type UploadProgressEvent
} from 'element-plus';
import { UploadAjaxError } from 'element-plus/es/components/upload/src/ajax';

import { HttpResponse } from '@core/http/types';

import { uploadChunkApi, uploadMergeApi, uploadSingleApi } from '../api';
import { getFileChunks, getFileNameFromUrl } from '../utils';

import type { ChunkFile, UploadOptions, UploadFormData } from '../types';

/**
 * 分片上传
 *
 * 1. 使用文件 MD5 请求接口判断是否已上传过. 是就返回上传后文件路径, 否则进行下一步
 * 2. 对分片文件进行分片
 * 3. 循环上传. 上传过程有一个失败则终止, 否则进行下一步
 * 4. 分片上传完成, 发起合并文件合并的请求, 返回文件路径
 *
 * @export
 * @param {UploadOptions} [options]
 * @return {*}  {({
 *   uploading: Ref<boolean>;
 *   fileDate: Ref<{ path: string; filename: string } | null | undefined>;
 *   handleUploadFile: (options: UploadRequestOptions) => Promise<void>;
 * })}
 */
export function useUploadHandler(options?: UploadOptions) {
  const { multipart = true, chunkSizeLimit = 5, maxChunkCount = 100 } = options ?? {};
  // 分片上传边界大小（单个分片大小）
  const CHUNK_SIZE_LIMIT = 1024 * 1024 * chunkSizeLimit;
  // 切片最大数
  const MAX_CHUNK_COUNT = maxChunkCount;
  // 上传中
  const uploading = ref(false);
  // 上传队列
  const uploadQueue = ref<UploadRequestOptions[]>([]);
  // 文件列表
  const fileList = ref<UploadFile[]>([]);
  // 上传文件列表
  const uploadFileList = ref<UploadFile[]>([]);

  /**
   * 添加文件到待上传队列中
   *
   * - 待上传队列只有一个文件时, 触发上传进程
   *
   * @param {UploadRequestOptions} requestOptions
   */
  const handleAddFileToUploadQueue = ((requestOptions: UploadRequestOptions) => {
    uploadQueue.value.push(requestOptions);

    uploadFileList.value.push({
      ...requestOptions.file,
      status: 'ready'
    });

    // 如果待上传队列长度为 1 立即开始上传
    if (uploadQueue.value.length === 1) {
      _processQueueUpload();
    }
  }) as UploadRequestHandler;

  /**
   * 处理上传进程
   * @returns
   */
  const _processQueueUpload = async () => {
    if (uploadQueue.value.length === 0) {
      // console.log('全部上传完成');
      return;
    }

    const curRequestOptions = uploadQueue.value[0];
    const willUpdateFile = uploadFileList.value.find(
      (file) => file.uid === curRequestOptions.file.uid
    );

    // 更新为 uploading 状态
    uploading.value = true;
    const progressEvt = { percent: 0 } as UploadProgressEvent;
    curRequestOptions?.onProgress(progressEvt);
    willUpdateFile && (willUpdateFile.status = 'uploading');

    try {
      const { data } = await handleUploadFile(curRequestOptions);
      ElMessage.success({ message: '上传成功', grouping: true });
      // 更新成功状态 (会同步更新进度)
      willUpdateFile && (willUpdateFile.status = 'success');
      curRequestOptions?.onSuccess(data);

      // // 必须通过 onSuccess 更新状态后才能给文件列表添加文件
      // fileList.value.push({
      //   status: 'success',
      //   percentage: 100,
      //   uid: curRequestOptions.file.uid,
      //   name: curRequestOptions.file.name,
      //   url: curRequestOptions.file.path,
      //   response: {
      //     path: curRequestOptions.file.path,
      //     filename: curRequestOptions.file.name
      //   }
      // });
    } catch (err) {
      ElMessage.error({ message: '上传失败', grouping: true });
      willUpdateFile && (willUpdateFile.status = 'fail');
      curRequestOptions?.onError(new UploadAjaxError((err as Error)?.message, 200, 'POST', 'url'));
    } finally {
      uploading.value = false;
      // 移除已处理的文件并继续处理队列中下一个文件
      uploadQueue.value.shift();
      _processQueueUpload();
    }
  };

  /**
   * 处理文件上传
   *
   * @param {UploadRequestOptions} requestOptions
   */
  const handleUploadFile = async (requestOptions: UploadRequestOptions) => {
    const { data: _data, file } = requestOptions;

    if (file.size < CHUNK_SIZE_LIMIT || !multipart) {
      return _singleUpload(requestOptions);
    } else {
      return _multipartUpload(requestOptions);
    }
  };

  /**
   * 单文件上传
   *
   * @param {UploadRequestOptions} requestOptions
   * @return {*}  {Promise<HttpResponse<{ path: string; filename: string }>>}
   */
  const _singleUpload = async (
    requestOptions: UploadRequestOptions
  ): Promise<HttpResponse<{ path: string; filename: string }>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { file } = requestOptions;
        const formData: UploadFormData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        const res = await uploadSingleApi(formData);
        resolve(res);
      } catch (err) {
        console.error('[RENDERER_SINGLE_UOLOAD]:error', err);
        reject(err);
      }
    });
  };

  /**
   * 大文件切片上传
   *
   * @param {UploadRequestOptions} requestOptions 上传文件配置
   */
  const _multipartUpload = async (
    requestOptions: UploadRequestOptions
  ): Promise<HttpResponse<{ path: string; filename: string }>> => {
    return new Promise(async (resolve, reject) => {
      const { file } = requestOptions;
      // 已上传成功数量
      let index = 0;
      // 已上传的切片
      const already: string[] = [];
      // 获取文件切片
      const { chunks, count, hash } = await getFileChunks(file, CHUNK_SIZE_LIMIT, MAX_CHUNK_COUNT);

      /**
       * 重置状态
       *
       * - 清空已上传切片集合
       * - 进度
       * - uploading
       *
       */
      const clear = (): void => {
        already.splice(0, already.length);
      };

      /**
       * 切片上传成功
       *
       * @param {ChunkFile} chunk 切片
       * @return {*}  {Promise<void>}
       */
      const complate = async (chunk?: ChunkFile): Promise<void> => {
        // 处理进度、记录已上传切片
        index += 1;

        // 更新进度、更新状态
        const progressEvt = { percent: (index / count) * 100 } as UploadProgressEvent;
        requestOptions?.onProgress(progressEvt);

        chunk && already.push(chunk.filename);

        if (index < count) {
          return;
        }

        // 当所有切片上传成功后, 进行合并文件操作请求
        try {
          const res = await uploadMergeApi({ hash, count });
          resolve(res);
        } catch (err) {
          console.error('[RENDERER_MULTIPART_UOLOAD]:chunk merge error', err);
          clear();
          reject(err);
        } finally {
          // uploading.value = false;
        }
      };

      // 循环把每个切片上传到服务上
      chunks.forEach(async (chunkItem) => {
        // 已经上传无需上传（当作上传成功处理）
        if (already.length > 0 && already.includes(chunkItem.filename)) {
          complate();
          return;
        }

        try {
          const formData: UploadFormData = new FormData();
          formData.append('file', chunkItem.file);
          formData.append('filename', chunkItem.filename);
          await uploadChunkApi(formData);

          complate(chunkItem);
        } catch (err) {
          console.error('[RENDERER_MULTIPART_UOLOAD]:chunk upload err', err);
          clear();
          reject(err);
        }
      });
    });
  };

  /**
   * 设置文件列表
   *
   * - 父组件已上传完的图片 + 待上传 + 上传中
   *
   * @param {string[]} urlList
   */
  const setFileList = (urlList: string[]) => {
    fileList.value = urlList
      .map((url, idx) => {
        const name = getFileNameFromUrl(url)!;
        const fileItem: UploadFile = {
          status: 'success',
          percentage: 100,
          uid: Date.now() + idx,
          name,
          url,
          response: {
            path: url,
            filename: name
          }
        };
        return fileItem;
      })
      .concat(uploadFileList.value.filter((file) => !['success', 'fail'].includes(file.status)));
  };

  return {
    uploading,
    fileList,
    handleAddFileToUploadQueue,
    setFileList
  };
}
