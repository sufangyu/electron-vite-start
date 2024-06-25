import http from '@renderer/core/http';

import * as Types from '../types';

/**
 * 小文件上传
 * @param formData
 * @returns
 */
export const uploadSingleApi = (formData: Types.SingleUploadReq) => {
  return http.post<{ path: string; filename: string }>({
    url: '/api/upload-single',
    data: formData,
    loadingMessage: '上传中...',
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 上传切片
 * @param formData
 * @returns
 */
export const uploadChunkApi = (formData: Types.MultipartUploadChunkReq) => {
  return http.post<Types.MultipartUploadChunkRes>({
    url: '/api/upload-chunk',
    data: formData,
    loadingMessage: '上传中...',
    isIgnoreCancel: true,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

/**
 * 合并切片
 * @param data
 * @returns
 */
export const uploadMergeApi = (data: { hash: string; count: number }) => {
  return http.post<{ path: string; filename: string }>({
    url: '/api/upload-merge',
    data,
    loadingMessage: '合并中...'
  });
};
