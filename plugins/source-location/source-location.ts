import { Plugin } from 'vite';
import { codeLineTrack } from './utils';

let isProd = true;

/**
 * 注入文件地址&行号插件
 *
 * ⚠️注意: 要在 `Vue()` 插件前调用, 避免源码已经被编译
 * @returns
 */
export default function sourceLocation(): Plugin {
  return {
    name: 'vite:source-location',
    configResolved(config) {
      isProd = config.mode === 'production';
    },
    transform(code, filePath) {
      if (isProd) {
        return code;
      }

      const index = filePath.lastIndexOf('.');
      const ext = filePath.substr(index + 1);
      if (ext.toLowerCase() === 'vue') {
        return codeLineTrack(code, filePath);
      }

      return code;
    }
  };
}
