/**
 *  初始化渲染进程模块
 *
 *  npm run init:module [moduleName]
 */
const fs = require('fs');

const {
  defaultContentConfig,
  entryContent,
  permissionContentConfig,
  vueContentConfig
} = require('./content.config');
const { createFileAndWriteContent } = require('./utils');

const moduleName = process.argv[2];

runInitModule(moduleName);

/**
 * 执行初始化模块
 * @param {*} moduleName
 */
function runInitModule(moduleName) {
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
  // 创建 api、composables、constant、types、views 内容
  ['api', 'composables', 'constant', 'types', 'permission', 'entry', 'views'].forEach((feat) => {
    const contentConfig = getInitContentConfig(feat);
    const initContent = contentConfig.join('\n');

    switch (feat) {
      case 'entry':
        createFileAndWriteContent(`${modulePath}/index.ts`, initContent);
        break;
      case 'permission':
        createFileAndWriteContent(`${modulePath}/${feat}/index.ts`, initContent);
        break;
      case 'views':
        createFileAndWriteContent(`${modulePath}/${feat}/index.vue`, initContent);
        break;
      default:
        createFileAndWriteContent(`${modulePath}/${feat}/index.ts`, initContent);
        break;
    }
  });

  console.log(`${moduleName} 模块初始化完成`);
}

/**
 * 获取初始化内容配置
 * @param {*} type
 * @returns
 */
function getInitContentConfig(type) {
  const contentConfigMap = {
    entry: entryContent,
    permission: permissionContentConfig,
    views: vueContentConfig
  };

  return contentConfigMap[type] || defaultContentConfig;
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
