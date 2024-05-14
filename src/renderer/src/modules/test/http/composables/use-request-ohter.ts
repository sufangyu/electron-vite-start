import { ElMessage } from 'element-plus';
import { useDownload } from '@core/hooks';
import { getRequestStatus, getResponseResult } from '../api';

const { downloadByBlob } = useDownload();

// 响应结果、请求状态、文件下载
export default () => {
  // 模拟响应结果
  const handleResponseResult = async (res: 'success' | 'fail') => {
    const result = await getResponseResult(res);
    console.log('[RENDER_REQUEST] 响应状态结果:', result);
  };

  // 模拟请求状态
  const handleRequestStatus = async (status: number) => {
    try {
      const result = await getRequestStatus(status);
      console.log('[RENDER_REQUEST] status:', result);
    } catch (error) {
      console.log('[RENDER_REQUEST] 请求状态结果:', error);
    }
  };

  // 文件下载
  const handleDownloadFile = async (type: 'bolb' | 'json') => {
    const urlMap = {
      bolb: `/download/file.pdf`,
      json: `/download/file-json`
    };

    try {
      await downloadByBlob({
        url: urlMap[type],
        filename: '前端文件名'
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : error;
      ElMessage.error(`导出失败-${errMsg}`);
    }
  };

  return {
    handleResponseResult,
    handleRequestStatus,
    handleDownloadFile
  };
};
