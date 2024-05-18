import { Plugin } from 'vite';

import { openEditor } from './utils';

/**
 * 响应源码定位服务
 *
 * @export
 * @param {Options} options
 * @return {*}  {Plugin}
 */
export default function sourceLocationServer(options: Options): Plugin {
  return {
    name: 'vite:source-location-server',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/open-ide', (req, _res, next) => {
        if (req.method === 'GET') {
          const { editor = 'vscode' } = options;
          const [_, search] = (req.url ?? '').split('?');

          openEditor(search, editor);
          next();
        } else {
          next();
        }
      });
    }
  };
}

interface Options {
  /**
   * 编辑器类型. 默认是 vscode, 支持 vscode、webstorm
   *
   * @type {('vscode' | 'webstorm')}
   * @memberof Options
   */
  editor: 'vscode' | 'webstorm';
}
