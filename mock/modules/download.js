const fs = require('fs');
const { join } = require('path');

const downloadModule = {
  'GET /download/file.pdf': (_req, res) => {
    const filePath = join(__dirname, '../assets/file.pdf');
    const filename = '接口返回的文件名.pdf';
    const file = fs.readFileSync(filePath);

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename));
    res.setHeader('Content-Type', 'application/pdf'); // 返回 Blob 格式的文件
    res.send(file);
  },
  'GET /download/file-json': (_req, res) => {
    const filePath = join(__dirname, '../assets/file.zip');
    const filename = '接口返回的文件名.pdf';

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.setHeader('Content-disposition', 'attachment; filename=' + encodeURIComponent(filename));
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(filePath);
  }
};

module.exports = downloadModule;
