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
