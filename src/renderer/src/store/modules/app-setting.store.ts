import { defineStore } from 'pinia';
import { useTheme, useRequestProxy } from '@modules/frame/setting';

export default defineStore(
  'app-setting',
  () => {
    const { theme, setTheme } = useTheme();
    const { requestProxy, setRequestProxy } = useRequestProxy();

    return {
      // 主题
      theme,
      setTheme,

      // 拦截重定向配置
      requestProxy,
      setRequestProxy
    };
  },
  {
    persist: {
      paths: ['theme', 'requestProxy']
    }
  }
);
