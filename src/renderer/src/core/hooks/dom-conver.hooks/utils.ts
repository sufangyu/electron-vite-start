import DomToImage from 'dom-to-image-more';
import { ElLoading } from 'element-plus';
import { type LoadingInstance } from 'element-plus/es/components/loading/src/loading';

import { ConverToImageConfig, ImageType } from './types';

/**
 * 生成图片方法映射
 */
export const domToImageFuncMap: Record<
  ImageType,
  (node: Node, options?: ConverToImageConfig) => Promise<string | Blob | Uint8ClampedArray>
> = {
  svg: DomToImage.toSvg,
  png: DomToImage.toPng,
  jpeg: DomToImage.toJpeg,
  bolb: DomToImage.toBolb,
  pixel: DomToImage.toPixelData
};

/**
 * loading helper
 * - show
 * - hide
 */

export const loadingHelper = (() => {
  let _instance: LoadingInstance | null = null;

  return {
    show(text: string) {
      this.close();

      _instance = ElLoading.service({
        lock: true,
        text
      });
    },

    close() {
      _instance?.close();
      _instance = null;
    }
  };
})();
