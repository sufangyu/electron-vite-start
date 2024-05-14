import { DIRECTORY_TYPE } from '@share/modules';

/**
 * 目录操作 Hooks
 *
 * @export
 * @return {*}  {{
 *   directoryOpen: (type: DIRECTORY_TYPE, fullPath?: string) => void;
 * }}
 */
export function useDirectory(): {
  directoryOpen: (type: DIRECTORY_TYPE, fullPath?: string) => void;
} {
  // 打开目录
  const directoryOpen = (type: DIRECTORY_TYPE, fullPath?: string) => {
    window.api?.directoryOpen?.(type, fullPath);
  };

  return {
    directoryOpen
  };
}
