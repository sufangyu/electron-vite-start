import { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { MessageTypedFn } from 'element-plus';

import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading.d';

/**
 * 请求配置
 *
 * @export
 * @interface HttpRequestConfig
 * @extends {AxiosRequestConfig}
 */
export interface HttpRequestConfig extends AxiosRequestConfig {
  /**
   * 服务标识, 用于处理 baseURL
   *
   * @type {('base' | 'open')}
   * @memberof HttpRequestConfig
   */
  server?: 'base' | 'open';
  /**
   * 是否显示 loading 提示
   *
   * @type {boolean}
   * @memberof HttpRequestConfig
   */
  loading?: boolean;
  /**
   * loading 提示信息
   *
   * @type {string}
   * @memberof HttpRequestConfig
   */
  loadingMessage?: string;

  /**
   * 缓存正在处理请求的 key
   *
   * @type {string}
   * @memberof HttpRequestConfig
   */
  cacheRequestKey?: string;

  /**
   * 取消重复请求的标识 key 包含参数（params、data）
   *
   * 默认：false
   *
   * @type {boolean}
   * @memberof HttpRequestConfig
   */
  isCancelDuplicateWithArgs?: boolean;

  /**
   * 忽略强制取消请求. 默认 false
   */
  isIgnoreCancel?: boolean;

  // /**
  //  * 取消请求对象
  //  *
  //  * @type {Canceler}
  //  * @memberof HttpRequestConfig
  //  */
  // canceler?: Canceler;
}

/**
 * 请求成功结果响应体
 *
 * @export
 * @interface HttpResponse
 * @template T
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface HttpResponse<T = any> {
  /**
   * 响应是否成功
   *
   * @type {boolean}
   * @memberof HttpResponse
   */
  success?: boolean;
  /**
   * 响应 Code
   *
   * @type {string}
   * @memberof HttpResponse
   */
  code?: string;
  /**
   * 响应描述内容
   *
   * @type {string}
   * @memberof HttpResponse
   */
  message?: string;
  /**
   * 响应体实际数据
   *
   * @type {T}
   * @memberof HttpResponse
   */
  data: T;

  /**
   * 接口原始响应信息
   *
   * @type {AxiosResponse}
   * @memberof HttpResponse
   */
  rawResponse: AxiosResponse;
}

/**
 * 请求响应失败
 *
 * @export
 * @interface HttpResponseError
 */
export interface HttpResponseError extends AxiosResponse {
  /**
   * 错误信息
   *
   * @type {string}
   * @memberof HttpResponseError
   */
  message?: string;
  /**
   * 是否是取消请求
   *
   * @type {boolean}
   * @memberof HttpResponseError
   */
  isCancel?: boolean;
}

// helper ===================================================================
/**
 * 显示 loading 函数
 *
 * @param {string} msg 信息
 * @returns {LoadingInstance} loading 实例
 */
export type ShowLoadingCallback = (msg: string) => LoadingInstance;

/**
 * 关闭 loading 函数
 *
 * @param {LoadingInstance} instance loading 实例
 * @returns
 */
export type CloseLoadingCallback = (instance: LoadingInstance) => void;

/**
 * 请求扩展方法
 *
 * @export
 * @interface HelperOptions
 */
export interface HelperOptions {
  /**
   * 显示错误信息
   *
   * @type {MessageTypedFn}
   * @memberof HelperOptions
   */
  showErrorMessage: MessageTypedFn;

  /**
   * 关闭全部错误信息
   *
   * @memberof HelperOptions
   */
  closeAllErrorMessage: () => void;
  /**
   * 显示 Loading 处理函数
   *
   * @type {ShowLoadingCallback}
   * @memberof HelperOptions
   */
  showLoadingCallback: ShowLoadingCallback;
  /**
   * 关闭 Loading 处理函数
   *
   * @type {CloseLoadingCallback}
   * @memberof HelperOptions
   */
  closeLoadingCallback: CloseLoadingCallback;
}
