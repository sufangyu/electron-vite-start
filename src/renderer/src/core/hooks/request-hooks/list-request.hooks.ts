/* eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep, get } from 'lodash-es';
import { Ref, ref } from 'vue';
import { ListRequesReturn, ListRequestOptions, RequestStatus } from './types';
import { trimValue, updatePageUrl } from './utils';

/**
 * 列表请求 Hooks
 *
 * @export
 * @template T 请求返回值类型
 * @template P 参数类型
 * @template L 请求列表 Item 类型
 * @param {ListRequestOptions<T, P, L>} options 请求参数
 * @return {*}
 */
export function useListRequest<T = any, P = any, L = any>(
  options: ListRequestOptions<T, P, L>
): ListRequesReturn<T, P, L> {
  const cacheOptions = cloneDeep(options);
  const { isUpdatePageUrl = false } = cacheOptions;
  const { api } = cacheOptions.request ?? {};
  const {
    pageNumKey = 'pageNum',
    pageSizeKey = 'pageSize',
    params: reqParams,
    handleParams,
    handleValidate,
    handleCustomResetParams
  } = cacheOptions.request ?? {};
  const {
    handleResponseData,
    listKey = 'data.list',
    totalKey = 'data.total'
  } = cacheOptions.response ?? {};

  const loading = ref(false);
  const resultStatus = ref<RequestStatus>('normal');
  const list = ref([]) as Ref<L[]>;
  const listTotal = ref(0);
  const params = ref(cloneDeep(reqParams ?? {})) as Ref<P>;

  // 列表查询
  const handleSearch = async (pageNum = 1, isReset = false) => {
    if (pageNumKey in (params.value ?? {})) {
      params.value[pageNumKey] = pageNum;
    }

    // 校验参数
    if (handleValidate && !handleValidate(params.value)) {
      return Promise.resolve(null);
    }

    // 处理请求参数
    let curParams = cloneDeep<P>(params.value);
    if (handleParams) {
      curParams = handleParams(curParams);
    }
    curParams = trimValue(curParams);

    try {
      loading.value = true;
      const res = await api(curParams);
      resultStatus.value = res.success ? 'success' : 'fail';

      listTotal.value = get(res, totalKey!);
      let rawList: L[] = get(res, listKey!);
      if (handleResponseData) {
        rawList = handleResponseData(rawList);
      }
      list.value = rawList;

      // 更新页面 URL, 记录查询参数
      if (isUpdatePageUrl) {
        updatePageUrl(curParams as object, isReset);
      }

      return Promise.resolve(res);
    } catch (error) {
      resultStatus.value = 'error';
    } finally {
      loading.value = false;
    }

    return Promise.resolve(null);
  };

  // 重置查询
  const handleReset = () => {
    if (typeof handleCustomResetParams === 'function' && reqParams) {
      params.value = handleCustomResetParams(params.value, cloneDeep(reqParams));
    } else {
      reqParams && (params.value = cloneDeep(reqParams));
    }

    return handleSearch(1, true);
  };

  // 切换分页大小 刷新列表
  const handleCurrentChange = (pageNum: number) => {
    return handleSearch(pageNum);
  };

  // 切换页码 刷新列表
  const handleSizeChange = (pageSize: number) => {
    if (pageSizeKey in (params.value ?? {})) {
      params.value![pageSizeKey] = pageSize;
    }
    return handleSearch(1);
  };

  return {
    params,
    loading,
    resultStatus,
    list,
    listTotal,
    handleSearch,
    handleReset,
    handleCurrentChange,
    handleSizeChange
  };
}
