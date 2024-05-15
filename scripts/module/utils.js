const fs = require('fs');
const { dirname } = require('path');

module.exports = {
  /**
   * 创建文件 & 写入内容
   *
   * @param {*} filePath
   * @param {*} content
   */
  createFileAndWriteContent(filePath, content) {
    // 获取目录路径
    const directoryPath = dirname(filePath);

    // 创建目录和写入文件内容
    fs.mkdir(directoryPath, { recursive: true }, (err) => {
      if (err) {
        console.error('创建目录时出错：', err);
        return;
      }

      fs.writeFile(filePath, content, (err) => {
        if (err) {
          console.error('写入文件时出错：', err);
          return;
        }
      });
    });
  }
};
