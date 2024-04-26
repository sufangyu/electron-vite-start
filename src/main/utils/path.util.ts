/**
 * 获取打包后路径
 * @param rawPath 原始路径
 * @returns 打包后路径
 */
export const getBuildPath = (rawPath: string): string => {
  return rawPath.replace('app.asar', 'app.asar.unpacked');
};
