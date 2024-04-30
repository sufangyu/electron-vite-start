import { DIRECTORY_TYPE } from '@share/modules';

export default () => {
  const directoryOpen = (type: DIRECTORY_TYPE, fullPath?: string) => {
    window.api?.directoryOpen?.(type, fullPath);
  };

  return {
    directoryOpen
  };
};
