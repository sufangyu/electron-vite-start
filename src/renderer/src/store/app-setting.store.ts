import { defineStore } from 'pinia';
import { useTheme } from '@modules/theme/composables';

const { theme, setTheme } = useTheme();

export default defineStore(
  'app-setting',
  () => {
    return {
      theme,
      setTheme
    };
  },
  {
    persist: {
      paths: ['theme']
    }
  }
);
