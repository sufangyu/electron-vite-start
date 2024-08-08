import { ElLoading, ElMessage } from 'element-plus';
import { type LoadingInstance } from 'element-plus/es/components/loading/src/loading';
import jsPDF from 'jspdf';

import { getImageSize } from '../utils';

/**
 * 导出文件 Hooks
 *
 * @export
 * @return {*}
 */
export function useExportFile() {
  /**
   * 导出 base64 格式的图片为 PDF
   *
   * - 注意: 导出的 pdf 文件有分页时会出现图片裁切问题
   *
   * @param {{
   *     base64Content: string; // base64 内容
   *     filename?: string; // 文件名
   *     margin?: number; // 边距
   *     singlePage?: boolean; // 是否一页显示, 会缩放图片. 默认 false
   *     exportingText?: string; // 导出中文本
   *     successText?: string; // 导出成功文本
   *     errorText?: string; // 导出失败文本
   *   }} options
   * @return {*}  {Promise<void>}
   */
  const exportBase64ToPdf = async (options: {
    base64Content: string; // base64 内容
    filename?: string; // 文件名
    margin?: number; // 边距
    singlePage?: boolean; // 是否一页显示, 会缩放图片. 默认 false
    exportingText?: string; // 导出中文本
    successText?: string; // 导出成功文本
    errorText?: string; // 导出失败文本
  }): Promise<void> => {
    const {
      base64Content,
      filename = 'PDF',
      margin = 8,
      singlePage = false,
      exportingText = '导出中...',
      successText = '导出成功',
      errorText = '导出失败'
    } = options;

    if (!base64Content) {
      ElMessage.error({ message: '未发现图片', grouping: true });
      return;
    }

    let loadingInstance: LoadingInstance | null = null;

    try {
      loadingInstance = ElLoading.service({
        lock: true,
        text: exportingText
      });

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
      loadingInstance?.close();
    }
  };

  return {
    exportBase64ToPdf
  };
}
