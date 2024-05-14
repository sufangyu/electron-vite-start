import type { Ref } from 'vue';

/**
 * 获取权限的结果
 *
 * @export
 * @template T 权限配置的 key
 * @param {{
 *     [key in T]: string;
 *   }} permission 权限配置
 * @param {boolean} [isInitGet=true] 是否初始化获取
 * @return {*}
 */
export function useAuth<T extends string | number | symbol = string>(
  permission: { [key in T]: string },
  isInitGet: boolean = true
): {
  /** 权限结果 */
  AUTH_RESULT: Ref<Record<T, boolean> | undefined>;
  /** 获取权限结果 */
  getAuthResule: () => Record<T, boolean>;
} {
  // TODO: 权限编码. 当前为模拟数据, 实际通过接口获取
  const authList: string[] = [
    'test:create',
    'test:edit',
    'test:view-address',
    'test:view-mobile-x'
  ];

  const AUTH_RESULT = ref<Record<T, boolean>>();

  /**
   * 获取权限结果
   *
   * @return {*}  {Record<T, boolean>}
   */
  const getAuthResule = (): Record<T, boolean> => {
    const result = {} as Record<T, boolean>;
    Object.entries(permission).forEach(([k, v]) => {
      result[k] = authList.includes(v as string);
    });

    _setAuthResult(result);

    return result;
  };

  /**
   * 设置权限结果
   *
   * @param {Record<T, boolean>} result 结果
   */
  const _setAuthResult = (result: Record<T, boolean>) => {
    AUTH_RESULT.value = result;
  };

  // 初始化时获取权限结果
  if (isInitGet) {
    getAuthResule();
  }

  return {
    AUTH_RESULT,
    getAuthResule
  };
}
