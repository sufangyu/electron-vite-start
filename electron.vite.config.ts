import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { SourceLocationServer, SourceLocation } from './plugins/source-location';
import { version } from './package.json';

// 命令执行 npm run dev -- -- debug
const argv = yargs(hideBin(process.argv)).argv._ ?? [];
const IS_DEBUG = argv.includes('debug');

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@share': resolve('src/share'),
        '@main': resolve('src/main')
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@share': resolve('src/share')
      }
    }
  },
  renderer: {
    plugins: [
      SourceLocationServer({
        editor: 'vscode' // "vscode" | "webstorm"
      }),
      SourceLocation(),
      vue(),
      vueJsx(),
      AutoImport({ imports: ['vue', 'vue-router'], dts: './src/auto-imports.d.ts' })
    ],
    resolve: {
      alias: {
        '@share': resolve('src/share'),
        '@renderer': resolve('src/renderer/src'),
        '@core': resolve('src/renderer/src/core'),
        '@layout': resolve('src/renderer/src/layout'),
        '@pages': resolve('src/renderer/src/pages'),
        '@components': resolve('src/renderer/src/components'),
        '@modules': resolve('src/renderer/src/modules'),
        '@store': resolve('src/renderer/src/store'),
        '@router': resolve('src/renderer/src/router')
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(version),
      __IS_DEBUG__: JSON.stringify(IS_DEBUG)
    }
  }
});
