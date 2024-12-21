export interface DictionaryItem {
  id: string | number;
  parentId: string | number;
  value: string | number;
  label: string;
  disabled?: boolean;
  children?: DictionaryItem[];
}

export interface ResDictionaryItem {
  dictId?: string;
  dictCode?: string;
  dictName?: string;
  values?: DictionaryItem[];
}

export interface DictionaryOptions<T extends string> {
  /**
   * 字典配置
   */
  dictOptions: {
    /**
     * 字典编码
     *
     * @type {T}
     */
    code: T;
    /**
     * 最大层级
     * - 0 表示不限制
     *
     * @type {number}
     * @default 0
     */
    maxLevel?: number;
    /**
     * 用于过滤字典的状态 默认true
     * - true || '1' 为启用的
     * - false || '0' 为停用的
     * - null || '' 为全部（不执行过滤）
     *
     * @default true
     */
    isEnable?: boolean;
  }[];
  /**
   * 字典请求函数
   *
   * @param {{
   *   codes: string[];
   *   isEnable?: boolean;
   * }} data
   * @return {*}  {Promise<ResDictionaryItem[]> | ResDictionaryItem[]}
   */
  apiFunc: (data: {
    codes: string[];
    isEnable?: boolean;
  }) => Promise<ResDictionaryItem[]> | ResDictionaryItem[];
  /**
   * 是否立即请求数据
   *
   * @type {boolean}
   * @memberof DictionaryOptions
   * @default true
   */
  immediate?: boolean;
  /**
   * 用于过滤字典的状态（接口）
   *
   * - true || '1' 为启用的
   * - false || '0' 为停用的
   * - null || '' 为全部（不执行过滤）
   *
   * @memberof DictionaryOptions
   * @default true
   */
  isEnable?: boolean;
}
