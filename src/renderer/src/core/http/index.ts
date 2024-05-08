import axios, { AxiosInstance, CreateAxiosDefaults, Method } from 'axios';
import type { HttpRequestConfig, HttpResponse } from './types';
import { API_BASE_URL } from './constant';
import interceptors from './interceptors';

class HttpController {
  // 默认配置
  private defaultConfig: HttpRequestConfig = {
    server: 'base',
    url: '/',
    baseURL: API_BASE_URL,
    method: 'GET',
    params: {},
    data: {},
    responseType: 'json',
    loading: true,
    loadingMessage: '加载中...',
    isCancelDuplicateWithArgs: false,
    isIgnoreCancel: false
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
    const { request, response } = this.instance.interceptors;
    // 请求拦截
    request.use((config) => interceptors.handleRequestDefault(config));
    request.use((config) => interceptors.handleRequestConfigUrl(config));
    request.use((config) => interceptors.handleRequestDuplicate(config));

    // 响应拦截
    response.use((res) => interceptors.handleResponseDefault(res));
    response.use(
      (res) => res,
      (err) => interceptors.handleResponseRefreshToken(err, this.instance)
    );
    response.use(
      (res) => interceptors.handleResponseFail(res),
      (err) => interceptors.handleResponseError(err)
    );
    response.use((res) => interceptors.handleResponseSuccess(res));
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
    if (interceptors.isRefreshing && interceptors.isRefreshTokenMode) {
      // 如果正在刷新 token, 则将请求放入队列中等待刷新完成后再发送
      return interceptors.pushRequestsQueue(requestConfig);
    }

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

    return mergeConfig;
  }
}

export default new HttpController();
