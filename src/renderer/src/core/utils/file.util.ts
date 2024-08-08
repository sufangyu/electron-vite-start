/**
 * base64转File
 * @param {*} dataUrl base64编码数据
 * @param {*} filename 文件名
 * @return {*}
 */
export function base64toFile(dataUrl, filename = 'file'): File {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  // suffix是该文件的后缀
  const suffix = mime.split('/')[1];
  // atob 对经过 base-64 编码的字符串进行解码
  const bstr = atob(arr[1]);
  // n 是解码后的长度
  let n = bstr.length;
  // Uint8Array 数组类型表示一个 8 位无符号整型数组 初始值都是 数子0
  const u8arr = new Uint8Array(n);
  // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  // new File返回File对象 第一个参数是 ArraryBuffer 或 Bolb 或Arrary 第二个参数是文件名
  // 第三个参数是 要放到文件中的内容的 MIME 类型
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  });
}

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
