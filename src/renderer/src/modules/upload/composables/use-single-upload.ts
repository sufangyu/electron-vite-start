import { Ref, ref } from 'vue';
import type { UploadRequestOptions } from 'element-plus';
import type { UploadFormData } from '../types';
import { uploadSingleApi } from '../api';

/**
 * 小文件上传
 *
 * @export
 * @return {*}
 */
export function useSingleUpload(): {
  loading: Ref<boolean>;
  fileData: Ref<{ path: string; filename: string } | null | undefined>;
  handleUploadFile: (options: UploadRequestOptions) => Promise<void>;
} {
  /** 上传中 */
  const loading = ref(false);
  /** 上传成功的文件信息 */
  const fileData = ref<{ path: string; filename: string } | null>();

  /**
   * 上传文件
   *
   * @param {UploadRequestOptions} options
   */
  const handleUploadFile = async (options: UploadRequestOptions) => {
    const { data: _, file } = options;
    await singleUpload(file);
  };

  const singleUpload = async (file: File) => {
    try {
      loading.value = true;
      const formData: UploadFormData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      const { data } = await uploadSingleApi(formData);
      fileData.value = data;
    } catch (err) {
      console.error('[RENDERER_SINGLE_UOLOAD]:error', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    fileData,
    handleUploadFile
  };
}
