/**
 * 全局数据
 */
export const GLOBAL_DATA = {
  IS_DEV: !!import.meta.env.DEV,
  IS_PROD: !!import.meta.env.PROD,
  IS_DEBUG: import.meta.env.MODE === 'debug'
};
