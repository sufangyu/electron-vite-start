import { ElMessage } from 'element-plus';
import jsPDF from 'jspdf';
import { merge } from 'lodash-es';

import { getImageSize } from '@core/utils';

import { ConverToImageConfig, ConverToImageOptions, ConverToPdfOptions } from './types';
import { domToImageFuncMap, loadingHelper } from './utils';

export function useDomConver() {
  const domRef = ref<Element | null>(null);

  /**
   * DOM 转图片
   *
   * @param {ConverToImageOptions} [options]
   * @return {*}  {(Promise<string | Blob | Uint8ClampedArray | null>)}
   */
  const converToImage = async (
    options?: ConverToImageOptions
  ): Promise<string | Blob | Uint8ClampedArray | null> => {
    if (!domRef.value) {
      ElMessage.warning({ message: 'DOM 未渲染', grouping: true });
      return Promise.resolve(null);
    }

    const {
      type = 'png',
      loadingText = '生成中...',
      successText = '生成成功',
      errorText = '生成失败',
      config = {}
    } = options ?? {};
    let result: string | Blob | Uint8ClampedArray = '';

    try {
      loadingHelper.show(loadingText);
      const { width, height } = domRef.value!.getBoundingClientRect();
      const imgScale = config.scale ?? 2;
      const imgWidth = config.width ?? width;
      const imgHeight = config.height ?? height;
      const mergeConfig: ConverToImageConfig = merge({ bgcolor: '#fff' }, config, {
        scale: imgScale,
        width: imgWidth,
        height: imgHeight,
        style: {
          ...(config.style ?? {})
        }
      });

      result = await domToImageFuncMap[type](domRef.value!, mergeConfig);
      ElMessage.success({ message: successText, grouping: true });
    } catch (err) {
      console.error('生成失败', err);
      ElMessage.success({ message: errorText, grouping: true });
    } finally {
      loadingHelper.close();
    }

    return Promise.resolve(result);
  };

  /**
   * 转换为图片格式的 PDF
   *
   * - 原理: DOM -> base64 -> pdf
   * - 注意: 导出的 pdf 文件有分页时会出现图片裁切问题
   *
   * @param {ConverToPdfOptions} options
   * @return {*}  {Promise<void>}
   */
  const converToPdf = async (options: ConverToPdfOptions): Promise<void> => {
    const {
      filename = 'PDF',
      margin = 8,
      singlePage = false,
      exportingText = '导出中...',
      successText = '导出成功',
      errorText = '导出失败',
      converToImageOptions = {}
    } = options;

    const base64Content = (await converToImage(converToImageOptions)) as string;

    try {
      loadingHelper.show(exportingText);

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const { width: imgWidth, height: imgHeight } = await getImageSize(base64Content);

      // 计算图像的缩放比例
      const widthRatio = (pageWidth - 2 * margin) / imgWidth;
      const heightRatio = (pageHeight - 2 * margin) / imgHeight;
      const scale = singlePage ? Math.min(widthRatio, heightRatio) : widthRatio;

      // 计算缩放后的宽高、页数
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;
      const totalPages = Math.ceil(scaledHeight / (pageHeight - 2 * margin));

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // 计算每页显示的图像部分的偏移量
        const yOffset = -((i * (pageHeight - 2 * margin)) / scale);

        // 只绘制图像的一部分
        pdf.addImage(
          base64Content,
          'PNG',
          singlePage ? scaledWidth / 2 : margin, // 绘制开始坐标 X
          margin + yOffset * scale, // 绘制开始坐标 Y
          scaledWidth, // 宽
          scaledHeight, // 高
          undefined,
          'FAST'
        );
      }

      pdf.save(`${filename}.pdf`);
      ElMessage.closeAll();
      ElMessage.success({ message: successText, grouping: true });
    } catch (err) {
      console.error(err);
      ElMessage.success({ message: errorText, grouping: true });
    } finally {
      loadingHelper.close();
    }
  };

  return {
    domRef,
    converToImage,
    converToPdf
  };
}
