/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** electron缓存的前缀（主进程可用） */
  readonly VITE_ELECTRON_STORE_PREFIX: string;
  /** pinia store 缓存key的前缀（只渲染进程可用） */
  readonly RENDERER_VITE_PRE_STORE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
