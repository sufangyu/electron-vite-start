export interface AppSetting {
  /** 主题 */
  theme?: APP_THEME;
}

/**
 * 主题枚举
 *
 * @export
 * @enum {number}
 */
export enum APP_THEME {
  LIGHT = 'light',
  DARK = 'dark',
  /** 跟随系统 */
  SYSTEM = 'system'
}

/**
 * 网络状态
 *
 * - 在线: Online
 * - 离线: Offline
 *
 * @export
 * @enum {number}
 */
export enum NETWORK_STATUS {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

/**
 * 命令类型
 *
 * @export
 * @enum {number}
 */
export enum COMMAND_TYPE {
  OPEN_NETWORK_SETTINGS = 'open-network-settings',
  CUSTOM = 'custom'
}

/**
 * 请求重定向/代理
 *
 * @export
 * @interface RequestProxy
 */
export interface RequestProxyItem {
  /** 原地址 */
  originalUrl: string;
  /** 重定向/代理地址 */
  redirectUrl: string;
}
