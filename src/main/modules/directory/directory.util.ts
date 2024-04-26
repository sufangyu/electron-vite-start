import { dialog } from 'electron';

/**
 * 选择目录
 * @returns 返回目录路径 或 空字符串（取消选择）
 */
export const selectDirectory = async () => {
  const res = await dialog.showOpenDialog({
    title: '选择目录',
    properties: ['openDirectory', 'createDirectory']
  });

  return !res.canceled ? res.filePaths[0] : '';
};
