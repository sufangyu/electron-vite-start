import { merge } from 'lodash-es';
import QRCodeStyling, { type Extension, type Options, type DownloadOptions } from 'styled-qr-code';

/**
 * 二维码渲染
 *
 * - View 显示的图片为实际的二维码1/2
 *
 * @export
 * @param {Options} [options]
 * @return {*}
 */
export function useRQCode(options?: Options) {
  const defaultOptions = {
    data: '',
    width: 400,
    height: 400,
    type: 'canvas',
    margin: 4,
    // 背景色配置
    backgroundOptions: {
      color: '#ffffff'
      // gradient: {
      //   type: 'linear',
      //   rotation: 0,
      //   colorStops: [
      //     { offset: 0, color: '#ffffff' },
      //     { offset: 1, color: '#ffffff' }
      //   ]
      // }
    },
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    image: '',
    imageOptions: {
      hideBackgroundDots: true,
      crossOrigin: 'anonymous',
      imageSize: 0.5,
      margin: 20
    },
    // 码点配置
    dotsOptions: {
      type: 'square',
      color: '#000000'
      // gradient: {
      //   type: 'linear',
      //   rotation: 0,
      //   colorStops: [
      //     { offset: 0, color: '#000000' },
      //     { offset: 1, color: '#000000' }
      //   ]
      // }
    },
    // 码眼边框配置
    cornersSquareOptions: {
      type: 'square',
      color: '#000000'
      // gradient: {
      //   type: 'linear',
      //   rotation: 0,
      //   colorStops: [
      //     { offset: 0, color: '#000000' },
      //     { offset: 1, color: '#000000' }
      //   ]
      // }
    },
    // 码眼点配置
    cornersDotOptions: {
      type: 'square',
      color: '#000000'
      // gradient: {
      //   type: 'linear',
      //   rotation: 0,
      //   colorStops: [
      //     { offset: 0, color: '#000000' },
      //     { offset: 1, color: '#000000' }
      //   ]
      // }
    }
  } as Options;

  /**
   * 获取最新的配置
   *
   * @param {Options} [sources]
   * @return {*}
   */
  const getCurrentOptions = (sources?: Options): Options => {
    return merge({}, defaultOptions, sources);
  };

  const qrcodeRef = ref<HTMLElement | null>(null);
  let qrCode: QRCodeStyling | null = null;

  const createQRCode = (qrCodeOptions?: Options) => {
    const currentOptions = getCurrentOptions(qrCodeOptions);
    // console.log('currentOptions', currentOptions);
    qrCode = new QRCodeStyling(currentOptions);

    qrcodeRef.value!.innerHTML = '';
    qrCode.append(qrcodeRef.value!);
    qrcodeRef.value
      ?.querySelector('canvas')
      ?.setAttribute(
        'style',
        `width: ${qrCodeOptions!.width! / 2}px; height: ${qrCodeOptions!.height! / 2}px`
      );
  };

  // 更新二维码
  const updateQRCode = (qrCodeOptions?: Options) => {
    // fix: 重新创建, 解决颜色类型响应无效问题
    createQRCode(qrCodeOptions);
  };

  /**
   * 下载二维码图片
   *
   * @param {Extension} extension 图片格式
   * @param {string} [name] 文件名
   */
  const extensions: Extension[] = ['svg', 'png', 'jpeg', 'webp'];
  const downloadQRCode = async (extension?: string, name?: string) => {
    const downloadOpionts: DownloadOptions = {
      name: name ?? '',
      extension: (extensions.includes(extension?.toLocaleLowerCase() as unknown as Extension)
        ? extension?.toLocaleLowerCase()
        : 'png') as Extension
    };
    await qrCode?.download(downloadOpionts);
  };

  onMounted(() => {
    createQRCode(options);
  });

  return {
    qrcodeRef,
    createQRCode,
    updateQRCode,
    downloadQRCode
  };
}
