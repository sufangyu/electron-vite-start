import type { Ref } from 'vue';

import type { UploadRequestOptions } from 'element-plus';

import { useSingleUpload } from './use-single-upload';
import { uploadChunkApi, uploadMergeApi } from '../api';
import { getFileChunks } from '../utils';

import type { ChunkFile, MultipartUploadConfig, UploadFormData } from '../types';

/**
 * 分片上传
 *
 * 1. 使用文件 MD5 请求接口判断是否已上传过. 是就返回上传后文件路径, 否则进行下一步
 * 2. 对分片文件进行分片
 * 3. 循环上传. 上传过程有一个失败则终止, 否则进行下一步
 * 4. 分片上传完成, 发起合并文件合并的请求, 返回文件路径
 *
 * @export
 * @param {MultipartUploadConfig} [config]
 * @return {*}  {({
 *   loading: Ref<boolean>;
 *   progress: Ref<number>;
 *   fileDate: Ref<{ path: string; filename: string } | null | undefined>;
 *   handleUploadFile: (options: UploadRequestOptions) => Promise<void>;
 * })}
 */
export function useMultipartUpload(config?: MultipartUploadConfig): {
  loading: Ref<boolean>;
  progress: Ref<number>;
  fileDate: Ref<{ path: string; filename: string } | null | undefined>;
  handleUploadFile: (options: UploadRequestOptions) => Promise<void>;
} {
  const { maxSize = 5, maxChunkCount = 100 } = config ?? {};
  // 分片上传边界大小
  const MAX_SIZE_LIMIT = 1024 * 1024 * maxSize;
  // 单个分片大小
  const CHUNK_SIZE = MAX_SIZE_LIMIT;
  // 切片最大数
  const MAX_CHUNK_COUNT = maxChunkCount;

  /** 上传中 */
  const loading = ref(false);
  /** 进度 */
  const progress = ref(0);
  /** 上传成功的文件信息 */
  const fileDate = ref<{ path: string; filename: string } | null>();

  const handleUploadFile = async (options: UploadRequestOptions) => {
    const { data: _, file } = options;

    loading.value = true;

    if (file.size < MAX_SIZE_LIMIT) {
      await singleUpload(options);
    } else {
      await multipartUpload(file);
    }
  };

  const singleUpload = async (options: UploadRequestOptions) => {
    try {
      const { handleUploadFile: handleSingleUpload } = useSingleUpload();
      handleSingleUpload(options);
    } catch (err) {
      console.error('[RENDERER_MULTIPART_UOLOAD]:single upload err', err);
    } finally {
      loading.value = false;
    }
  };

  /**
   * 大文件切片上传
   *
   * @param {File} file 文件内容
   */
  const multipartUpload = async (file: File) => {
    // 已上传成功数量
    let index = 0;
    // 已上传的切片
    const already: string[] = [];
    // 获取文件切片 chunks: ChunkFile[]
    const { chunks, count, hash } = await getFileChunks(file, CHUNK_SIZE, MAX_CHUNK_COUNT);

    /**
     * 重置状态
     *
     * - 清空已上传切片集合
     * - 进度
     * - liading
     *
     */
    const clear = (): void => {
      already.splice(0, already.length);
      progress.value = 0;
      loading.value = false;
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
      progress.value = (index / count) * 100;
      chunk && already.push(chunk.filename);

      if (index < count) {
        return;
      }

      // 当所有切片上传成功后, 进度 100、进行合并文件操作请求
      progress.value = 100;
      try {
        const { data } = await uploadMergeApi({ hash, count });
        fileDate.value = data;
      } catch (err) {
        clear();
        console.error('[RENDERER_MULTIPART_UOLOAD]:chunk merge error', err);
      } finally {
        loading.value = false;
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
        clear();
        console.error('[RENDERER_MULTIPART_UOLOAD]:chunk upload err', err);
      }
    });
  };

  return { loading, progress, fileDate, handleUploadFile };
}
