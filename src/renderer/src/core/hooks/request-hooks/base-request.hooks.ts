/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { BaseRequesReturn, BaseRequestOptions, RequestStatus } from './types';
import { trimValue } from './utils';

/**
 * 基础请求Hooks
 *
 * @export
 * @template T 请求返回值类型
 * @template P 参数类型
 * @param {Options<T, P>} options 请求参数
 * @return {*}
 */
export function useBaseRequest<T = any, P = any>(
  options: BaseRequestOptions<T, P>
): BaseRequesReturn<T> {
  const cacheOptions = cloneDeep(options);
  const { api, params, handleParams, handleValidate } = cacheOptions.request ?? {};
  const { handleResponseData } = cacheOptions.response ?? {};

  const loading = ref(false);
  const resultStatus = ref<RequestStatus>('normal');
  const data = ref<T>();
  // 发出请求
  const handleRequest = async () => {
    // 校验参数
    if (handleValidate && !handleValidate(params)) {
      return Promise.resolve(null);
    }

    // 处理请求参数
    let curParams = cloneDeep(params);
    if (handleParams) {
      curParams = handleParams(curParams);
    }
    curParams = trimValue<P>(cloneDeep(params));

    try {
      loading.value = true;
      const res = await api(curParams);
      resultStatus.value = res.success ? 'success' : 'fail';
      data.value = res.data;

      if (handleResponseData) {
        data.value = handleResponseData(res.data);
      }

      return Promise.resolve(res);
    } catch (error) {
      resultStatus.value = 'error';
    } finally {
      loading.value = false;
    }

    return Promise.resolve(null);
  };

  return {
    loading,
    resultStatus,
    data,
    handleRequest
  };
}
