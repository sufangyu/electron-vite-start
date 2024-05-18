import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge } from 'electron';

import { events } from '@share/utils';

import { EnhanceApi } from './index.d';
import { appApi, windowApi, updaterApi, fileApi, videoApi } from './modules';

// 增强渲染进程功能 API
const api: EnhanceApi = {
  ...appApi,
  ...windowApi,
  ...updaterApi,
  ...fileApi,
  ...videoApi
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', { ...electronAPI, events });
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = { ...electronAPI, events };
  // @ts-ignore (define in dts)
  window.api = api;
}
