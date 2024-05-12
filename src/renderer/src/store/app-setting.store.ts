import { defineStore } from 'pinia';
import { useTheme, useRequestProxy } from '@modules/setting';

const { theme, setTheme } = useTheme();
const { requestProxy, setRequestProxy } = useRequestProxy();

export default defineStore(
  'app-setting',
  () => {
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
