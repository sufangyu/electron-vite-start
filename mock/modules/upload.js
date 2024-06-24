const fs = require('fs');
const path = require('path');

const multiparty = require('multiparty');

const uploadDir = path.join(__dirname, '../', 'uploads');
const HOSTNAME = `http://localhost:3721/`;

/**
 * 合并切片
 *
 * @param {*} hash 文件 hash 值
 * @param {*} count 切片数量
 * @param {*} cb 回调函数
 * @return {*}
 */
const merge = (hash, count, cb) => {
  let suffix = '';
  const filePath = `${uploadDir}/${hash}`;
  if (!fs.existsSync(filePath)) {
    return cb('压缩文件不存在', null);
  }

  // 文件切片
  const fileList = fs.readdirSync(filePath) ?? [];
  if (fileList.length < count) {
    return cb('切片尚未上传或未上传完', null);
  }

  // 排序后操作合并
  fileList
    .sort((a, b) => {
      const reg = /_(\d+)/;
      return reg.exec(a)[1] - reg.exec(b)[1];
    })
    .forEach((item) => {
      !suffix ? (suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1]) : null;
      // 添加文件切片，然后删除切片
      fs.appendFileSync(`${uploadDir}/${hash}.${suffix}`, fs.readFileSync(`${filePath}/${item}`));
      fs.unlinkSync(`${filePath}/${item}`);
    });

  // 删除目录, 返回数据
  fs.rmdirSync(filePath);
  return cb(null, {
    path: `${uploadDir}/${hash}.${suffix}`.replace(path.join(__dirname, '../'), HOSTNAME),
    filename: `${hash}.${suffix}`
  });
};

const uploadModule = {
  'POST /api/upload-single': (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status('500').json({
          success: false,
          message: '文件上传失败',
          data: err
        });
      }

      // 创建上传目录文件夹存在（在 mock 目录）
      !fs.existsSync(uploadDir) ? fs.mkdirSync(uploadDir, { recursive: true }) : null;

      // 获取上传的文件信息（文件 bolb、文件名）
      const file = (files.file && files.file[0]) || {};
      const filename = (fields.filename && fields.filename[0]) || '';
      const curFilePath = `${uploadDir}/`;
      const oldPath = file.path;
      const newPath = path.join(curFilePath, filename);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          return res.status('500').json({
            success: false,
            message: '保存文件失败',
            data: err
          });
        }

        return res.status('200').json({
          success: true,
          message: '文件上传成功',
          data: {
            filename: filename,
            path: newPath.replace(path.join(__dirname, '../'), HOSTNAME)
          }
        });
      });
    });
  },

  // 上传切片
  'POST /api/upload-chunk': (req, res) => {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status('500').json({
          success: false,
          message: '文件上传失败',
          data: err
        });
      }

      // 创建上传目录文件夹存在（在 mock 目录）
      !fs.existsSync(uploadDir) ? fs.mkdirSync(uploadDir, { recursive: true }) : null;

      // 获取上传的文件信息（文件 bolb、文件名）
      const file = (files.file && files.file[0]) || {};
      const filename = (fields.filename && fields.filename[0]) || '';

      // 创建存放切片的临时目录
      const [, HASH] = /^([^_]+)_(\d+)/.exec(filename);
      const curFilePath = `${uploadDir}/${HASH}`;
      !fs.existsSync(curFilePath) ? fs.mkdirSync(curFilePath) : null;

      const oldPath = file.path;
      const newPath = path.join(curFilePath, filename);

      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          return res.status('500').json({
            success: false,
            message: '保存文件失败',
            data: err
          });
        }

        return res.status('200').json({
          success: true,
          message: '文件上传成功',
          data: {
            originalFilename: filename,
            url: newPath.replace(path.join(__dirname, '../'), HOSTNAME)
          }
        });
      });
    });
  },

  // 合并切片
  'POST /api/upload-merge': (req, res) => {
    const { hash, count } = req.body;
    merge(hash, count, (err, result) => {
      if (err) {
        return res.status('200').json({
          success: false,
          message: err,
          data: null
        });
      }

      return res.status('200').json({
        success: true,
        message: '合并完成',
        data: result
      });
    });
  }
};

module.exports = uploadModule;
