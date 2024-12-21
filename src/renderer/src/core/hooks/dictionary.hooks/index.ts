import { cloneDeep } from 'lodash-es';

import { buildTree } from './utils';

import type { DictionaryItem, DictionaryOptions } from './types';

const globalDictionaryMap = reactive(new Map<string, DictionaryItem[]>());
const globalFlatDictionaryMap = reactive(new Map<string, DictionaryItem[]>());

/**
 * 字典表
 *
 * @export
 * @template T 字典编码类型
 * @param {DictionaryOptions<T>} options 字典配置
 * @return {*}
 */
export function useDictionary<T extends string>(options: DictionaryOptions<T>) {
  const { dictOptions = [], apiFunc, immediate = true, isEnable = true } = options ?? {};

  /** 是否正在加载 */
  const isLoading = ref(false);

  /**
   * 字典表列表
   */
  const dictionaryList = computed(() => (code: T) => {
    return globalFlatDictionaryMap.get(code) ?? [];
  });

  /**
   * 字典表列表
   */
  const dictionaryTree = computed(() => (code: T) => {
    return globalDictionaryMap.get(code) ?? [];
  });

  /**
   * 格式化字典标签
   */
  const formatDictionaryLabel = computed(() => (dictCode: T, value: string | number): string => {
    const flatDictList = globalFlatDictionaryMap.get(dictCode);
    if (!flatDictList) {
      return `${value}`;
    }

    const label = flatDictList?.find((it) => it.value === value)?.label;
    return label || `${value}`;
  });

  /**
   * 格式化字典标签列表
   */
  const formatDictionaryLabelList = computed(
    () =>
      (dictCode: T, values: (string | number)[]): string[] => {
        const flatDictList = globalFlatDictionaryMap.get(dictCode);
        if (!flatDictList) {
          return values.map((it) => `${it}`);
        }

        return values.map((value) => {
          const label = flatDictList?.find((it) => it.value === value)?.label;
          return label || `${value}`;
        });
      }
  );

  /**
   * 加载字典数据
   */
  const loadDictionary = async () => {
    try {
      isLoading.value = true;
      const data = await Promise.resolve(
        apiFunc?.({ codes: dictOptions.map((it) => it.code), isEnable })
      );

      (data ?? []).forEach((dictItem) => {
        const dictList = cloneDeep(dictItem.values ?? []);
        globalFlatDictionaryMap.set(dictItem.dictCode!, dictList);
        globalDictionaryMap.set(dictItem.dictCode!, buildTree(dictList));
      });

      return data;
    } catch (err) {
      return Promise.reject(err);
    } finally {
      isLoading.value = false;
    }
  };

  // 初始化加载字典数据
  if (immediate) {
    loadDictionary();
  }

  return {
    globalDictionaryMap,
    globalFlatDictionaryMap,
    dictionaryList,
    dictionaryTree,
    formatDictionaryLabel,
    formatDictionaryLabelList,
    isLoading,
    loadDictionary
  };
}
