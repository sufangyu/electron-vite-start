import { ElectronAPI } from '@electron-toolkit/preload';
import { RendererIpcEvents } from 'electron-events';
import { AppApi, WindowApi, UpdaterApi, FileApi, VideoApi } from './modules';

interface IElectron extends ElectronAPI {
  /** 事件总线 */
  events: RendererIpcEvents;
}

interface WindowInfo {
  /** 窗口ID */
  id: number;
  /** 窗口名称 */
  name: string;
  /** 窗口标题 */
  title: string;
}

declare global {
  interface Window {
    readonly electron: IElectron;
    readonly api: EnhanceApi;
    /** APP 版本号（只渲染进程可用） */
    readonly __APP_VERSION__?: string;
    readonly windowInfo: WindowInfo;
  }
}

/**
 * 增强渲染进程的 window api
 */
export interface EnhanceApi extends AppApi, WindowApi, UpdaterApi, FileApi, VideoApi {}
