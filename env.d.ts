/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * API Base
   *
   * @type {string}
   * @memberof ImportMetaEnv
   */
  readonly VITE_API_BASE: string;

  /**
   * electron 缓存的前缀（主进程可用）
   *
   * @type {string}
   * @memberof ImportMetaEnv
   */
  readonly VITE_ELECTRON_STORE_PREFIX: string;

  /**
   * pinia store 缓存key的前缀（只渲染进程可用）
   *
   * @type {string}
   * @memberof ImportMetaEnv
   */
  readonly RENDERER_VITE_PRE_STORE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
