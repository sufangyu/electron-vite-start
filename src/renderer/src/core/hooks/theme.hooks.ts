export const useTheme = (): {
  /** 匹对暗黑主题对象 */
  darkThemeMedia: MediaQueryList;

  /**
   * 处理 HTML 文档元素
   * @param isDark 是否为暗黑主题
   * @param className 暗黑主题 class 名
   * @returns
   */
  handleDocumentElement: (isDark: boolean, className?: string) => void;

  /** 跟随系统主题 */
  followSystemTheme: () => void;
} => {
  const darkThemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

  const handleDocumentElement = (isDark: boolean, className = 'dark') => {
    isDark
      ? document.documentElement.classList.add(className)
      : document.documentElement.classList.remove(className);
  };

  const followSystemTheme = () => handleDocumentElement(darkThemeMedia.matches);

  return {
    darkThemeMedia,
    handleDocumentElement,
    followSystemTheme
  };
};
