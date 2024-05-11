import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import { version } from './package.json';

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
      __APP_VERSION__: JSON.stringify(version)
    }
  }
});
