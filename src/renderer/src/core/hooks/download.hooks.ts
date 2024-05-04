/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '@core/http';
import { HttpResponse } from '@renderer/core/http/types';

/**
 * 获取文件名
 *
 * 1. 先使用前端设置的文件名
 * 2. 再使用接口响应头的文件名
 * 3. 最后使用请求路径的文件信息
 *
 * @param {string} [filename=''] 前端设置的文件名
 * @param {string} [resFilename=''] 接口返回的文件名
 * @param {string} [url=''] 请求路径
 * @return {*}  {string}
 */
const getFilename = (filename: string = '', resFilename: string = '', url: string = ''): string => {
  const [, urlFilename] = url.match(/\/([^/]+)$/) || [];
  const [, urlExt = ''] = urlFilename.split('.');

  if (!filename && !resFilename && !urlExt) {
    throw new Error(`无法从传参、请求路径、接口响应头获取到文件名`);
  }

  let rawFilename = filename;
  // 有传文件名称但没有格式拓展名 使用接口返回或请求路径的文件拓展名
  if (filename && !filename?.includes('.')) {
    const [, ext] = resFilename.split('.');
    rawFilename = `${filename}.${ext || urlExt}`;
  }

  return rawFilename || resFilename || urlFilename;
};

export const useDownload = (): {
  downloadByBlob: <T>(config: DownloadByBlobConfig<T>) => Promise<any>;
} => {
  /**
   * 下载文件（blob文件流）
   *
   * @template T
   * @param {DownloadByBlobConfig<T>} config
   * @return {*}
   */
  const downloadByBlob = async <T = any>(
    config: DownloadByBlobConfig<T>
  ): Promise<HttpResponse> => {
    const {
      url,
      method = 'get',
      params,
      data,
      filename,
      loading = true,
      loadingMessage = '下载中...'
    } = config;

    const response = await http.request({
      url,
      method,
      params,
      data,
      responseType: 'blob',
      loading,
      loadingMessage
    });

    const { rawResponse } = response;
    const isBlod = rawResponse.data instanceof Blob;

    if (isBlod) {
      // 从响应头获取文件名 & 处理文件名
      const { headers } = rawResponse;
      const contentDisposition = headers['content-disposition'];
      const resFilename = contentDisposition
        ? decodeURIComponent(contentDisposition.split(';')[1].split('filename=')[1])
        : '';
      const curFilename = getFilename(filename, resFilename, url);

      // 将 Blob 对象转换为 URL
      const urlByBlob = URL.createObjectURL(new Blob([rawResponse.data]));
      const link = document.createElement('a');
      link.href = urlByBlob;
      link.setAttribute('download', curFilename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(urlByBlob);
    } else {
      throw new Error('接口返回非 Bolb 文件流');
    }

    return Promise.resolve(response);
  };

  return { downloadByBlob };
};

interface DownloadByBlobConfig<T> {
  url: string;
  method?: 'get' | 'post';
  params?: T;
  data?: T;
  loading?: boolean;
  loadingMessage?: string;
  /**
   * 文件名称
   *
   * @type {string}
   * @memberof DownloadByBlobConfig
   */
  filename?: string;
}
