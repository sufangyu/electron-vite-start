import axios, { AxiosInstance, CreateAxiosDefaults, Method, Canceler } from 'axios';
import { HttpRequestConfig, HttpResponse } from './types';
import {
  handleRequestDefault,
  handleRequestConfigUrl,
  handleRequestDuplicate,
  handleResponseDefault,
  handleResponseSuccess,
  handleResponseFail,
  handleResponseError
} from './interceptors/index';

class HttpController {
  // 默认配置
  private defaultConfig: HttpRequestConfig = {
    url: '/',
    baseURL: import.meta.env.VITE_API_BASE,
    method: 'GET',
    params: {},
    data: {},
    responseType: 'json',
    loading: true,
    loadingMessage: '加载中...',
    isCancelDuplicateWithArgs: false
  };

  // 单例
  private instance: AxiosInstance;

  // 创建实例配置
  private instanceConfig: CreateAxiosDefaults = {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    withCredentials: true
  };

  constructor() {
    this.instance = axios.create(this.instanceConfig);
    this.handleInterceptors();
  }

  /**
   * 拦截器
   *
   * @memberof HttpController
   */
  handleInterceptors() {
    // 请求拦截
    this.instance.interceptors.request.use(handleRequestDefault, (error) => Promise.reject(error));
    this.instance.interceptors.request.use(handleRequestConfigUrl);
    this.instance.interceptors.request.use(handleRequestDuplicate);

    // 响应拦截
    this.instance.interceptors.response.use(handleResponseDefault);
    this.instance.interceptors.response.use(handleResponseFail, handleResponseError);
    this.instance.interceptors.response.use(handleResponseSuccess);
  }

  /**
   * GET 请求
   *
   * @param {Omit<HttpRequestConfig, 'data'>} config 请求配置
   * @return {*}  {Promise<AxiosResponse>}
   * @memberof HttpController
   */
  async get<T>(config: Omit<HttpRequestConfig, 'data'>): Promise<HttpResponse<T>> {
    const mergetConfig = this.getMergeConfig(config, 'GET');
    return this.request(mergetConfig);
  }

  /**
   * POST 请求
   *
   * @param {Omit<HttpRequestConfig, 'params'>} config 请求配置
   * @return {*}  {Promise<AxiosResponse>}
   * @memberof HttpController
   */
  async post<T>(config: Omit<HttpRequestConfig, 'params'>): Promise<HttpResponse<T>> {
    const mergetConfig = this.getMergeConfig(config, 'POST');
    return this.request(mergetConfig);
  }

  /**
   * PUT 请求
   *
   * @param {HttpRequestConfig} config 请求配置
   * @return {*}  {Promise<AxiosResponse>}
   * @memberof HttpController
   */
  async put<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const mergetConfig = this.getMergeConfig(config, 'PUT');
    return this.request(mergetConfig);
  }

  /**
   * DELETE 请求
   *
   * @param {HttpRequestConfig} config 请求配置
   * @return {*}  {Promise<AxiosResponse>}
   * @memberof HttpController
   */
  async delete<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const mergetConfig = this.getMergeConfig(config, 'DELETE');
    return this.request(mergetConfig);
  }

  /**
   * 通用请求方法
   *
   * @param {HttpRequestConfig} requestConfig 请求配置项
   * @return {*}  {Promise<AxiosResponse>}
   * @memberof HttpController
   */
  async request<T>(requestConfig: HttpRequestConfig): Promise<HttpResponse<T>> {
    const response = await this.instance.request(requestConfig);

    return {
      ...response.data,
      rawResponse: response
    };
  }

  /**
   * 合并配置
   *
   * @private
   * @param {HttpRequestConfig} requestConfig 请求配置项
   * @param {Method} method 请求方法
   * @return {*}  {HttpRequestConfig}
   * @memberof HttpController
   */
  private getMergeConfig(requestConfig: HttpRequestConfig, method: Method): HttpRequestConfig {
    const mergeConfig = {
      ...this.defaultConfig,
      ...requestConfig,
      method
    };

    // 取消请求
    mergeConfig.cancelToken = new axios.CancelToken((c: Canceler) => {
      mergeConfig.canceler = c;
    });

    return mergeConfig;
  }
}

export default new HttpController();
