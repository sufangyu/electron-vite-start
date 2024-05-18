import { APP_IPC_CHANNEL, APP_IPC_CHANNEL_EVENT, APP_THEME, WINDOW_NAME } from '@share/modules';

import { useEvents, useTheme } from '@core/hooks';

const events = useEvents();
const { darkThemeMedia, followSystemTheme, handleDocumentElement } = useTheme();
const DEFAULT_THEME = APP_THEME.LIGHT;
const theme = ref<APP_THEME>(DEFAULT_THEME);

export default () => {
  const _themeControl = (curTheme: APP_THEME) => {
    darkThemeMedia.removeEventListener('change', followSystemTheme);

    if (curTheme === APP_THEME.SYSTEM) {
      followSystemTheme();
      darkThemeMedia.addEventListener('change', followSystemTheme);
    } else {
      handleDocumentElement(curTheme === APP_THEME.DARK);
      darkThemeMedia.removeEventListener('change', followSystemTheme);
    }
  };

  // 监听主题切换事件
  const _onChangeTheme = () => {
    events?.on(WINDOW_NAME.ANY, APP_IPC_CHANNEL, ({ event, data }) => {
      if (event === APP_IPC_CHANNEL_EVENT.SET_THEME) {
        const curTheme = data?.detail as APP_THEME;
        theme.value = curTheme;
        _themeControl(curTheme);
      }
    });
  };

  // 初始化主题(主进程 > 浏览器 > 默认值)
  const _initThemeFromMainPrcess = async () => {
    const appSettingStore = await window.api?.getAppSetting?.();
    const APP_STORE_KEY = import.meta.env.RENDERER_VITE_PRE_STORE_KEY + 'app-setting';
    const appStore = JSON.parse(localStorage.getItem(APP_STORE_KEY) ?? '{}');
    const mainProcessTheme = appSettingStore?.theme ?? appStore.theme ?? DEFAULT_THEME;
    theme.value = mainProcessTheme;
  };

  // 设置主题
  const setTheme = (curTheme: APP_THEME) => {
    theme.value = curTheme;
    events?.emitTo(WINDOW_NAME.ANY, APP_IPC_CHANNEL, {
      event: APP_IPC_CHANNEL_EVENT.SET_THEME,
      data: {
        message: '设置主题',
        detail: curTheme
      }
    });

    _themeControl(curTheme);
  };

  (() => {
    _onChangeTheme();
    _initThemeFromMainPrcess();
  })();

  return {
    theme,
    setTheme
  };
};
