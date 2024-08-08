/**
 * Blob 转 base64
 *
 * @param {Blob} blob
 * @param {string} type base64 格式
 * @return {*}  {Promise<string>}
 */
export const blobToBase64 = (blob?: Blob, type: 'png' | 'jpeg' = 'png'): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (!blob) {
      reject('缺少 blob 数据');
    }

    const reader = new FileReader();
    reader.readAsDataURL(blob!);
    reader.onload = () => {
      let base64 = reader.result as string;
      const format = `data:image/${type};base64`;
      if (format) {
        const base64Content = base64.split(',')[1];
        base64 = `${format},${base64Content}`;
      }

      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * base64 转 Blob
 *
 * @param {string} base64
 * @return {*}  {Promise<Blob>}
 */
export const base64ToBlob = async (base64: string): Promise<Blob> => {
  const response = await fetch(base64);
  return response.blob();
};

/**
 * base64 转 ArrayBuffer
 *
 * @param {string} base64
 * @return {*}  {ArrayBuffer | null}
 */
export const base64ToArrayBuffer = (base64: string): ArrayBuffer | null => {
  if (!base64) {
    console.error('缺少 base64 数据');
    return null;
  }

  const binaryString = window.atob(base64.split(',')[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * base64 转 File
 *
 * @param {string} base64 base64
 * @param {string} filename 文件名
 * @return {*}  {Promise<File | null>}
 */
export const base64ToFile = async (
  base64: string,
  filename: string = 'filename'
): Promise<File | null> => {
  if (!base64) {
    return Promise.reject('缺少 base64 数据');
  }

  const blob = await base64ToBlob(base64);
  return new File([blob], filename, { type: blob.type });
};

/**
 * file 转 base64
 *
 * @param {File} file
 * @return {*}  {Promise<string>}
 */
export const fileToBase64 = (file?: File): Promise<string | null> => {
  if (!file) {
    console.error('缺少 file');
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * 图片转 base64
 *
 * @param {string} url 图片地址
 * @return {*}  {Promise<string>}
 */
export const imageToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return blobToBase64(blob) as Promise<string>;
};

/**
 *
 *
 * @param {ArrayBuffer} buffer
 * @return {*}  {string}
 */
export const arrayBufferToBase64 = (buffer?: ArrayBuffer): string => {
  if (!buffer) {
    console.error('缺少 buffer 数据');
    return '';
  }
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:application/octet-stream;base64,${window.btoa(binary)}`;
};

/**
 * 获取 base64 图片宽高信息
 *
 * @param {string} base64
 * @return {*}  {Promise<{ width: number; height: number }>}
 */
export const getImageSize = (base64: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      resolve({ width, height });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = base64;
  });
};
