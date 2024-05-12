import { protocolReg } from './rules';

/**
 * 判断是否是以 'http://'、'https://' 开头
 *
 * @param {string} url 地址字符串
 * @return {*}  {boolean}
 */
export const isHttpOrHttps = (url: string): boolean => {
  return protocolReg.test(url);
};
