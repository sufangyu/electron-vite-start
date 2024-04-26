const useStorageUtil = (
  type: 'localStorage' | 'sessionStorage'
): {
  getItem: <T = string>(key: string) => T | null;
  setItem: <T = string>(key: string, value: T) => void;
  remove: (key: string) => void;
  clear: () => void;
} => {
  const getItem = <T>(key: string) => {
    const valStr = window[type].getItem(key);
    const val: T = valStr ? JSON.parse(valStr) : null;
    return val;
  };

  const setItem = <T>(key: string, value: T) => {
    window[type].setItem(key, JSON.stringify(value));
  };

  const remove = (key: string) => window[type].removeItem(key);

  const clear = () => window[type].clear();

  return {
    getItem,
    setItem,
    remove,
    clear
  };
};

export const localStorageUtil = useStorageUtil('localStorage');

export const sessionStorageUtil = useStorageUtil('sessionStorage');

// window.localStorage.getItem;
// window.sessionStorage.setItem;
