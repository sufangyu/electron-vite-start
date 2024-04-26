/**
 * 判断资源是否是外部资源（http、https开头）
 * @param url 路径资源
 * @returns
 */
export const isExternal = (url: string): boolean => {
  const urlPattern: RegExp = /^(http:\/\/|https:\/\/)/;
  return urlPattern.test(url);
};
