import axios, { AxiosError, AxiosResponse } from 'axios';
import { HttpRequestConfig, HttpResponse, HttpResponseError } from '../types';
import helper from '../helper';

const MESSAGE_MAP: Record<string, string> = {
  400: '错误请求',
  401: '会话过期，请重新登录',
  403: '拒绝访问',
  404: '请求错误，未找到该资源',
  405: '请求方法未允许',
  408: '请求超时',
  500: '服务器端出错',
  501: '网络未实现',
  502: '网络错误',
  503: '服务不可用',
  504: '网络超时',
  505: 'HTTP版本不支持该请求'
};

/**
 * 处理基础响应, 如: loading
 *
 * @export
 * @param {AxiosResponse} response
 * @return {*}
 */
export function handleResponseDefault(response: AxiosResponse): AxiosResponse {
  const requestConfig: HttpRequestConfig = response.config;

  if (requestConfig.loading) {
    helper.hideFullScreenLoading();
  }

  return response;
}

/**
 * 响应拦截器 - 处理成功响应
 *
 * @export
 * @param {AxiosResponse} response 响应体
 * @return {*}  {(Promise<AxiosResponse> | AxiosResponse)}
 */
export function handleResponseSuccess(
  response: AxiosResponse<HttpResponse>
): Promise<AxiosResponse> | AxiosResponse {
  if (response.config.responseType?.toLocaleLowerCase() === 'blob') {
    // 处理二进制数据, 通常用于下载文件
    return Promise.resolve(response);
  }

  const { success } = response.data ?? {};
  if (success) {
    return Promise.resolve(response);
  }

  return response;
}

/**
 * 响应拦截器 - 处理业务错误
 *
 * @export
 * @param {AxiosResponse<HttpResponse>} response 响应体
 * @return {*}  {(Promise<AxiosResponse<HttpResponse>> | AxiosResponse<HttpResponse>)}
 */
export function handleResponseFail(
  response: AxiosResponse
): Promise<AxiosResponse<HttpResponse>> | AxiosResponse<HttpResponse> {
  if (response.config.responseType?.toLocaleLowerCase() === 'blob') {
    return Promise.resolve(response);
  }

  const { data } = response;
  const { success, message } = data as HttpResponse;
  if (!success) {
    helper.showMessage(message || '操作失败');
    return Promise.reject(data);
  }

  return response;
}

/**
 * 响应拦截器 - 处理请求失败
 *
 * @export
 * @param {AxiosError} error 错误信息
 * @return {*}  {Promise<HttpResponseError>}
 */
export function handleResponseError(error: AxiosError): Promise<HttpResponseError> {
  helper.hideFullScreenLoading();

  // 处理取消请求
  const axiosError = error;
  if (axios.isCancel(axiosError)) {
    return Promise.reject({
      ...error.response,
      status: 499,
      statusText: 'Canceled',
      message: error.message,
      isCancel: true
    });
  }

  // 处理 HTTP 错误
  const message = error?.response
    ? MESSAGE_MAP[error.response?.status] || '连接错误'
    : error.message || '连接服务器失败';

  const { status = '', statusText = '未知错误' } = error?.response || {};
  const errorMessage = `${status ? `[${status}] ` : ''}${message}`;
  helper.showMessage(errorMessage);

  // 处理登录过期 & 没有权限
  if (status && status === 401) {
    console.log('[IPC_REQUEST] TODO: 处理录过期 & 没有权限');
  }

  return Promise.reject({
    ...error.response,
    status,
    statusText,
    message,
    isCancel: false
  });
}
