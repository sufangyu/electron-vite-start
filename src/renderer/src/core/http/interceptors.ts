import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  CancelTokenSource,
  InternalAxiosRequestConfig
} from 'axios';
import { HttpRequestConfig, HttpResponse, HttpResponseError } from './types';
import helper, { isEmptyObject } from './helper';
import {
  API_BASE_URL,
  LOADING_MESSAGE_MAP,
  MESSAGE_MAP,
  TOKEN_HEADER_KEY,
  REFRESH_TOKEN_HEADER_KEY,
  SKIP_CANCEL_HEADER_KEY
} from './constant';

// 请求单例
const requestInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  withCredentials: true
});

/**
 * 请求拦截器
 *
 * @class Interceptors
 */
class Interceptors {
  /** 记录缓存请求中的对象 */
  private cacheRequestPromise: Record<string, CancelTokenSource | undefined> = {};

  /** 刷新 token 模式 */
  isRefreshTokenMode = false;
  /** 是否正在刷新的标记 */
  isRefreshing = false;
  /** 刷新 token 请求地址 */
  private refreshTokenUrl = '';
  /**  队列，用于暂存等待发送的请求 */
  private requestsQueue: {
    config: HttpRequestConfig;
    resolve: (value) => void;
    reject: (reason?) => void;
  }[] = [];

  /**
   * Creates an instance of Interceptors.
   * @param {{ refreshTokenUrl?: string }} options 初始化配置
   * @memberof Interceptors
   */
  constructor(options: { refreshTokenUrl?: string }) {
    const { refreshTokenUrl = '' } = options;
    this.isRefreshTokenMode = !!refreshTokenUrl;
    this.refreshTokenUrl = refreshTokenUrl;
  }

  /**
   * 处理 loading 文案、请求头
   *
   * @export
   * @param {HttpRequestConfig} config 配置
   * @return {*}  {InternalAxiosRequestConfig}
   * @memberof Interceptors
   */
  handleRequestDefault(config: HttpRequestConfig): InternalAxiosRequestConfig {
    // loading 遮罩层提示文案
    const METHOD = config.method!.toLocaleUpperCase();
    if (config.loading) {
      LOADING_MESSAGE_MAP[METHOD] && (config.loadingMessage = LOADING_MESSAGE_MAP[METHOD]);
      const message = config.loadingMessage;
      helper.showFullScreenLoading(message);
    }

    // 请求头
    const headers = this.getHeaders(config!);
    const token = helper.getAccessToken();
    token && headers.set(TOKEN_HEADER_KEY, token);
    const resultConfig: InternalAxiosRequestConfig = {
      ...config,
      headers
    };
    return resultConfig;
  }

  /**
   * 处理请求 url
   *
   * - 非 http、https: 按照服务拼接完整 url
   * - http、https: 直接使用
   *
   * @param {HttpRequestConfig} config
   * @return {*}  {InternalAxiosRequestConfig}
   * @memberof Interceptors
   */
  handleRequestConfigUrl(config: HttpRequestConfig): InternalAxiosRequestConfig {
    // 处理完整 URL. 非 http, https 才处理
    const isExternal = /^(https?:)/.test(config.url!);
    const API_BASE = API_BASE_URL;
    if (!isExternal && API_BASE.startsWith('http')) {
      const API_BASE = API_BASE_URL;
      config.url = `${API_BASE}${config.url}`;
    }

    // 请求头
    const headers = this.getHeaders(config!);
    const resultConfig: InternalAxiosRequestConfig = {
      ...config,
      headers
    };
    return resultConfig;
  }

  /**
   * 请求拦截器 - 处理重复请求
   *
   * 如后续发起请求已存在并且再等待响应中时, 取消正在等待的相同请求
   *
   * @param {HttpRequestConfig} config
   * @return {*}  {InternalAxiosRequestConfig}
   * @memberof Interceptors
   */
  handleRequestDuplicate(config: HttpRequestConfig): InternalAxiosRequestConfig {
    // 处理取消重复请求
    const { isIgnoreCancel } = config;
    const headers = this.getHeaders(config!);
    const cacheRequestKey = this.getCacheRequestKey(config);

    if (
      this.cacheRequestPromise[cacheRequestKey] &&
      !isIgnoreCancel &&
      !headers.has(SKIP_CANCEL_HEADER_KEY)
    ) {
      // 调用取消请求: 已存在 + 非忽略强制取消请求 + 不跳过取消处理
      this.cacheRequestPromise[cacheRequestKey]?.cancel('请求已取消', config);
    }

    // 创建新的取消请求标识
    const cancelTokenSource = axios.CancelToken.source();
    this.cacheRequestPromise[cacheRequestKey] = cancelTokenSource;
    config.cancelToken = cancelTokenSource.token;

    const resultConfig: InternalAxiosRequestConfig = {
      ...config,
      headers
    };
    return resultConfig;
  }

  /**
   *  处理基础响应
   *
   * - 删除请求中对象中已完成的请求
   * - 隐藏 loading
   *
   * @param {AxiosResponse} response 响应体
   * @return {*}  {AxiosResponse}
   * @memberof Interceptors
   */
  handleResponseDefault(response: AxiosResponse): AxiosResponse {
    // 删除请求中对象中已完成的请求
    const responseConfig: HttpRequestConfig = response.config;
    const cacheRequestKey = this.getCacheRequestKey(responseConfig);
    delete this.cacheRequestPromise[cacheRequestKey];

    // 隐藏 loading
    this.hideFullScreenLoading(responseConfig);

    return response;
  }

  /**
   * 响应拦截器 - 处理成功响应
   *
   * @param {AxiosResponse<HttpResponse>} response 响应体
   * @return {*}  {(Promise<AxiosResponse> | AxiosResponse)}
   * @memberof Interceptors
   */
  handleResponseSuccess(
    response: AxiosResponse<HttpResponse>
  ): Promise<AxiosResponse> | AxiosResponse {
    const requestConfig: HttpRequestConfig = response.config;

    // 处理二进制数据, 通常用于下载文件
    if (requestConfig.responseType?.toLocaleLowerCase() === 'blob') {
      return Promise.resolve(response);
    }

    // 正常业务响应
    const { success } = response.data ?? {};
    if (success) {
      return Promise.resolve(response);
    }

    return response;
  }

  /**
   * 响应拦截器 - 处理业务错误
   *
   * @param {AxiosResponse} response 响应体
   * @return {*}  {(Promise<AxiosResponse<HttpResponse>> | AxiosResponse<HttpResponse>)}
   * @memberof Interceptors
   */
  handleResponseFail(
    response: AxiosResponse
  ): Promise<AxiosResponse<HttpResponse>> | AxiosResponse<HttpResponse> {
    const responseConfig: HttpRequestConfig = response.config;
    this.hideFullScreenLoading(responseConfig);

    if (responseConfig.responseType?.toLocaleLowerCase() === 'blob') {
      return Promise.resolve(response);
    }

    const { data = {} } = response;
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
   * @param {AxiosError} error 错误信息
   * @return {*}  {Promise<HttpResponseError>}
   * @memberof Interceptors
   */
  handleResponseError(error: AxiosError): Promise<HttpResponseError> {
    const responseConfig: HttpRequestConfig | undefined = error.config;
    this.hideFullScreenLoading(responseConfig);

    // 处理取消请求的响应
    const axiosError = error;
    if (axios.isCancel(axiosError)) {
      return Promise.reject({
        ...error?.response,
        status: 499,
        statusText: 'Canceled',
        message: error.message,
        isCancel: true
      });
    }

    // 处理 HTTP 错误提示
    // 1. 刷新 token 模式时 + 不是登录过期
    // 2. 非刷新 token 模式
    const message = error?.response
      ? MESSAGE_MAP[error.response?.status] || '连接错误'
      : error?.message || '连接服务器失败';
    const { status = '', statusText = 'Unknown Error' } = error?.response || {};
    const errorMessage = `${status ? `[${status}] ` : ''}${message}`;

    if ((this.isRefreshTokenMode && status !== 403) || !this.isRefreshTokenMode) {
      helper.showMessage(errorMessage);
    }

    // 退出登录处理（401表示未登录, 403表示登录过期）
    // 1. 刷新 token 模式时: 未登录
    // 2. 非刷新 token 模式时: 未登录或者登录过期
    const refreshTokenModeCheck = this.isRefreshTokenMode && status && [401].includes(status);
    const unRefreshTokenModeCheck =
      !this.isRefreshTokenMode && status && [401, 403].includes(status);
    if (refreshTokenModeCheck || unRefreshTokenModeCheck) {
      helper.logout();
    }

    return Promise.reject({
      ...error?.response,
      status,
      statusText,
      message,
      isCancel: false
    });
  }

  /**
   * 刷新 Token
   *
   * @param {AxiosError} error 错误信息
   * @param {AxiosInstance} axiosInstance axios 实例
   * @return {*}  {Promise<AxiosError>}
   * @memberof Interceptors
   */
  handleResponseRefreshToken(
    error: AxiosError,
    axiosInstance: AxiosInstance
  ): Promise<AxiosError> | null {
    // 非刷新 token 模式, 直接跳过返回错误
    if (!this.isRefreshTokenMode) {
      return Promise.reject(error);
    }

    // 删除记录缓存请求中的请求
    if (error.config) {
      const requestConfig: HttpRequestConfig = error.config;
      const cacheRequestKey = this.getCacheRequestKey(requestConfig);
      delete this.cacheRequestPromise[cacheRequestKey];
    }

    // 处理 HTTP 错误
    const message = error?.response
      ? MESSAGE_MAP[error.response?.status] || '连接错误'
      : error.message || '连接服务器失败';

    const { status = '' } = error?.response || {};
    const errorMessage = `${status ? `[${status}] ` : ''}${message}`;
    if (status !== 403 || (status === 403 && !this.isRefreshTokenMode)) {
      helper.showMessage(errorMessage);
    }

    const originalRequest = error.config;
    if (status !== 403 || originalRequest?.url?.includes(this.refreshTokenUrl)) {
      // 不需要刷新 token 状态码, 直接跳过返回错误
      return Promise.reject(error);
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      return new Promise((resolve, reject) => {
        // 将失败的请求暂存到队列中
        this.requestsQueue.push({ config: originalRequest as HttpRequestConfig, resolve, reject });

        // 不存在刷新 token, 直接去登录页面
        const refreshToken = helper.getRefreshAccessToken();
        if (!refreshToken) {
          this.requestsQueue = [];
          helper.logout();
          this.isRefreshing = false;
          return reject(error);
        }

        // 刷新 token 的逻辑
        this.refreshTokenApi()
          .then(({ data }) => {
            if (!data.success) {
              // 未登录
              this.requestsQueue = [];
              helper.logout();
              this.isRefreshing = false;
              return;
            }

            const { accessToken, refreshToken } = data.data;
            helper.updateToken(accessToken, refreshToken);

            // 使用新的 token 重新发送所有暂存的请求后清空请求队列
            originalRequest?.headers.set(TOKEN_HEADER_KEY, accessToken);
            originalRequest?.headers.set(SKIP_CANCEL_HEADER_KEY, 'yes');
            this.requestsQueue.forEach((request) => {
              request.resolve(
                axiosInstance({
                  ...originalRequest!,
                  ...request.config
                })
              );
            });
            this.requestsQueue = [];
          })
          .catch((error: AxiosError) => {
            // 清空请求队列
            this.requestsQueue.forEach((request) => request.reject(error));
            this.requestsQueue = [];
            helper.logout();
            this.isRefreshing = false;
            reject(error);
          })
          .finally(() => {
            this.isRefreshing = false;
          });
      });
    } else {
      // 如果正在刷新 token, 暂存请求到队列中
      this.pushRequestsQueue(originalRequest as HttpRequestConfig);
    }

    return Promise.reject(error);
  }

  /**
   * 将请求放入队列中
   *
   * @param {HttpRequestConfig} requestConfig
   * @return {*}
   * @memberof Interceptors
   */
  pushRequestsQueue(requestConfig: HttpRequestConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      this.requestsQueue.push({ config: requestConfig, resolve, reject });
    });
  }

  /**
   * 隐藏 loading
   *
   * @private
   * @param {HttpRequestConfig} [config]
   * @memberof Interceptors
   */
  private hideFullScreenLoading(config?: HttpRequestConfig): void {
    if (config?.loading) {
      helper.hideFullScreenLoading();
    }
  }

  /**
   * 刷新 token 请求
   *
   * @private
   * @memberof Interceptors
   */
  private refreshTokenApi = () => {
    return requestInstance.get(this.refreshTokenUrl, {
      headers: {
        [REFRESH_TOKEN_HEADER_KEY]: helper.getRefreshAccessToken()
      }
    });
  };

  /**
   * 获取请求头
   *
   * @param {HttpRequestConfig} config
   * @return {*}  {AxiosRequestHeaders}
   */
  private getHeaders = (config: HttpRequestConfig): AxiosRequestHeaders => {
    // FIX: Type '{}' is not assignable to type 'AxiosRequestHeaders'
    // https://github.com/axios/axios/issues/5573#issuecomment-1644862647
    const headers: AxiosRequestHeaders = new AxiosHeaders();
    Object.entries(config.headers ?? {}).forEach(([key, value]) => {
      headers.set(key, value);
    });

    return headers;
  };

  /**
   * 获取缓存缓存 Key
   *
   * 1. 使用配置传入的缓存 Key
   * 2. 使用请求方法 + URL + [参数]生成缓存 Key
   *
   * @private
   * @param {HttpRequestConfig} config
   * @return {*}  {string}
   * @memberof Interceptors
   */
  private getCacheRequestKey(config: HttpRequestConfig): string {
    const { method, url, baseURL = '', isCancelDuplicateWithArgs } = config;
    const pathname = url?.replace(baseURL, '');
    let { cacheRequestKey } = config;
    if (cacheRequestKey) {
      return cacheRequestKey;
    }

    const METHOD = method!.toLocaleUpperCase();
    cacheRequestKey = `${METHOD!}__${pathname}`;
    // 缓存 key 加上参数
    if (isCancelDuplicateWithArgs) {
      const dataTemp = { ...config.data };
      const paramsTemp = { ...config.params };

      // 排除的参数
      ['_', 't'].forEach((key) => {
        delete dataTemp[key];
        delete paramsTemp[key];
      });

      !isEmptyObject(dataTemp) && (cacheRequestKey += `__${JSON.stringify(dataTemp)}`);
      !isEmptyObject(paramsTemp) && (cacheRequestKey += `__${JSON.stringify(paramsTemp)}`);
    }
    return cacheRequestKey;
  }
}

export default new Interceptors({
  refreshTokenUrl: '/api/token/refresh'
});
