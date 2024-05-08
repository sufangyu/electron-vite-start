/**
 *  初始化渲染进程模块
 *
 *  npm run init:module [moduleName]
 */
const fs = require('fs');
const { dirname } = require('path');
const moduleName = process.argv[2];

initModule(moduleName);

function initModule(moduleName) {
  // 已存在模块
  const moduleBaseDir = `./src/renderer/src/modules`;
  const modulePath = `${moduleBaseDir}/${moduleName}`;

  validateModule(moduleName, modulePath);
  createModule(moduleName, modulePath);
}

/**
 * 创建前校验
 *
 * @param {*} moduleName 模块名称
 * @param {*} modulePath 模块路径
 */
function createModule(moduleName, modulePath) {
  const permissionContent = [
    `import { useAuth } from '@core/hooks';`,
    ``,
    `// 权限配置`,
    `const PEEMISSION = Object.freeze({});`,
    ``,
    `const { AUTH_RESULT } = useAuth(PEEMISSION);`,
    ``,
    `export default AUTH_RESULT;`,
    ``
  ].join('\n');

  const entryConten = [
    `export * from './api/index';`,
    `export * from './composables/index';`,
    `export * from './constant/index';`,
    `export * from './permission/index';`,
    `export * from './types/index';`,
    ``
  ].join('\n');

  // 创建 api、composables、constant、types 内容
  ['api', 'composables', 'constant', 'types', 'permission', 'entry'].forEach((feat) => {
    switch (feat) {
      case 'entry':
        createFileAndWriteContent(`${modulePath}/index.ts`, entryConten);
        break;
      case 'permission':
        createFileAndWriteContent(`${modulePath}/${feat}/index.ts`, permissionContent);
        break;
      default:
        createFileAndWriteContent(`${modulePath}/${feat}/index.ts`, 'export {};\n');
        break;
    }
  });

  console.log(`${moduleName} 模块初始化完成`);
}

/**
 * 创建前校验
 *
 * @param {*} moduleName 模块名称
 * @param {*} modulePath 模块路径
 */
function validateModule(moduleName, modulePath) {
  // 缺少模块名称参数
  if (!moduleName) {
    console.warn('模块名称不能为空');
    console.log('eg: npm run init:module test');
    process.exit(0);
  }

  const isExist = fs.existsSync(modulePath);
  if (isExist) {
    console.warn(`模块(${moduleName})已存在`);
    process.exit(0);
  }
}

/**
 * 创建文件 & 写入内容
 *
 * @param {*} filePath
 * @param {*} content
 */
function createFileAndWriteContent(filePath, content) {
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
