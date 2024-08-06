import { getRequest } from '../api';
import * as Types from '../types';

export function useList() {
  const status = ref<'normal' | 'loading' | 'finished' | 'error'>('normal');
  const query = ref({
    pageNum: 1,
    pageSize: 5
  });
  const list = ref<Types.GetRequestListItem[]>([]);
  const isEmpty = ref(false);

  const loadMore = async () => {
    if (['loading', 'finished'].includes(status.value)) {
      return;
    }
    try {
      status.value = 'loading';
      const { data } = await getRequest(query.value);
      // mock 空数据
      // const newList = [];
      const newList = data.list ?? [];

      list.value.length === 0 ? (list.value = newList) : list.value.push(...newList);

      const isFinished = newList.length === 0;
      status.value = isFinished ? 'finished' : 'normal';
      isEmpty.value = query.value.pageNum === 1 && list.value.length === 0;
      !isFinished && (query.value.pageNum += 1);
    } catch (_err) {
      status.value = 'error';
    }
  };

  return {
    status,
    isEmpty,
    list,
    loadMore
  };
}
