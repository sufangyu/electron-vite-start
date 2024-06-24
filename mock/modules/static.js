const fs = require('fs');
const path = require('path');

// 简单的 MIME 类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf'
  // 添加更多需要的 MIME 类型
};

const staticModule = {
  'GET /uploads/:filepath': (req, res) => {
    const { filepath } = req.params;
    const UPLOADS_DIR = path.join(__dirname, '../', 'uploads');
    const fileLocation = path.join(UPLOADS_DIR, filepath);

    fs.exists(fileLocation, (exists) => {
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: '文件未找到'
        });
      }

      // 读取文件
      fs.readFile(fileLocation, (err, fileContent) => {
        if (err) {
          console.error('读取文件时出错', err);
          return res.status(500).json({
            success: false,
            message: '读取文件时出错'
          });
        }

        const ext = path.extname(fileLocation).toLowerCase();
        // 获取文件扩展名, 根据扩展名获取 MIME 类型
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.setHeader('Content-Type', contentType);
        res.status(200).send(fileContent);
      });
    });
  }
};

module.exports = staticModule;
