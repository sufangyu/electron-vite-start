import { dialog } from 'electron';

class DirectoryController {
  /**
   * 选择目录
   *
   * @return {*} 返回目录路径 或 空字符串（取消选择）
   * @memberof DirectoryController
   */
  async selectDirectory(): Promise<string> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: '选择目录',
      properties: ['openDirectory', 'createDirectory']
    });

    return canceled ? '' : filePaths[0];
  }
}

export default new DirectoryController();
