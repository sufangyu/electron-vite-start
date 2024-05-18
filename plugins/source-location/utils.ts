import childProcess from 'child_process';
import os from 'os';

/**
 * 源代码跟踪
 * @param code 源码文本
 * @param filePath 源码文件地址
 * @returns
 */
export const codeLineTrack = (code: string, filePath: string): string => {
  // 换行分割文件内容成数组
  const codeList = code.split('\n');
  const newCodeList: string[] = [];

  // 遍历每一行, 进行文件、行号等信息追加
  codeList.forEach((item, index) => {
    const lineCode = getLineCode(item, index + 1, filePath);
    newCodeList.push(lineCode);
  });

  return newCodeList.join('\n');
};

/**
 * 获取增加行信息属性后的行代码
 *
 * @param lineCode 当前行的代码内容
 * @param line 行号
 * @param path 文件路径
 * @returns
 */
const getLineCode = (lineCode: string, line: number, path: string): string => {
  let newLineCode = lineCode;

  if (!/^\s+</.test(lineCode)) {
    // 非 html 标签
    return newLineCode;
  }

  // eslint-disable-next-line no-useless-escape
  const reg = /((((^(\s)+\<))|(^\<))[\w-]+)|(<\/template)/g;
  const startTagList = lineCode.match(reg);

  if (startTagList) {
    // HTML 开始标签
    const tagList = Array.from(new Set(startTagList));
    tagList.forEach((item) => {
      const ignoreTagList = [
        'KeepAlive',
        'template',
        'keep-alive',
        'transition',
        'router-view',
        // 'el-',
        // 'El',
        // 'van-',
        // 'Van',
        'use'
      ];
      const isIgnoreTag = ignoreTagList.some((i) => item.indexOf(i) > -1);
      if (item && !isIgnoreTag) {
        const regAttr = new RegExp(`${item}`);
        const location = `${item} data-code-location="${path}:${line}"`;
        newLineCode = lineCode.replace(regAttr, location);
      }
    });
  }

  return newLineCode;
};

/**
 * 打开编辑器
 * @param {string} search
 * @param {('vscode' | 'webstorm')} editor
 * @returns
 */
export const openEditor = (search: string, editor: 'vscode' | 'webstorm' = 'vscode') => {
  const params = new URLSearchParams(search);
  const filePath = params.get('filePath');

  if (!filePath) {
    return;
  }
  const [path, line = 1] = filePath.split(':');
  const platform = formatOS();

  switch (editor) {
    case 'vscode':
      childProcess.exec(`code -r -g ${filePath}`);
      break;
    case 'webstorm':
      if (platform === 'MacOS') {
        childProcess.exec(`webstorm --line ${line} ${path}`);
      } else if (platform === 'Windows') {
        childProcess.exec(`webstorm64.exe --line ${line} ${path}`);
      } else {
        childProcess.exec(`webstorm64 --line ${line} ${path}`);
      }
      break;
    default:
      console.warn('暂时不支持该编辑器');
      break;
  }
};

/**
 * 格式化平台
 * @returns
 */
function formatOS(): string {
  const osMap = {
    darwin: 'MacOS',
    linux: 'Linux',
    win32: 'Windows'
  };
  const platform = os.platform();

  return osMap[platform] ?? platform;
}
