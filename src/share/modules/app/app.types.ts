export interface AppSetting {
  /** 主题 */
  theme?: APP_THEME;
}

// 主题枚举
export enum APP_THEME {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
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
