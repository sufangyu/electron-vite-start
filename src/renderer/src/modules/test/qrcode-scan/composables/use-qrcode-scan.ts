import { type ScanResult, ready, scan } from 'qr-scanner-wechat';

export type qrCodeRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function useQRCodeScan(options?: {
  scanCount?: number;
  selectQRCode?: (result: ScanResult) => void;
}) {
  const readyScan = ready;

  const { scanCount = 4, selectQRCode } = options ?? {};
  const qrCodeScanVideo = ref<HTMLVideoElement>();
  const qrCodePreviewWrapper = ref<HTMLElement>();
  const qrCodePreview = ref<HTMLCanvasElement>();
  const resultList: ScanResult[] = [];

  /**
   * 绘制选择二维码触发区域
   *
   * @param {number} [scanScale=1]
   * @param {number} [previewScale=1]
   * @return {*}
   */
  const _drawSelectQRCodeTrigger = (scanScale: number = 1, previewScale: number = 1): void => {
    if (!qrCodePreviewWrapper.value) {
      return;
    }

    // 获取最终的值
    const getValueWithScale = (val: number) => {
      return (val / scanScale) * previewScale;
    };

    resultList.forEach((resultItem) => {
      const dom = document.createElement('div');
      const triggerAreaSize = {
        width: 40,
        height: 40
      };

      const { x = 0, y = 0, width = 0, height = 0 } = resultItem.rect ?? {};
      const _x = getValueWithScale(x) + getValueWithScale(width) / 2 - triggerAreaSize.width / 2;
      const _y = getValueWithScale(y) + getValueWithScale(height) / 2 - triggerAreaSize.height / 2;

      setInlineStyle(dom, {
        width: triggerAreaSize.width + 'px',
        height: triggerAreaSize.height + 'px',
        background: '#2ec1cc',
        position: 'absolute',
        zIndex: '99999',
        top: _y + 'px',
        left: _x + 'px',
        color: '#fff',
        textAlign: 'center',
        // borderRadius: '100px',
        // borderBlockColor: '#fff',
        // borderColor: 'unset',
        // borderRightStyle: 'solid',
        // borderWidth: '3px',
        animation: 'scaleAnimation 2s infinite alternate'
      });
      dom.style.borderRadius = '100px';
      dom.style.borderBlockColor = '#fff';
      dom.style.borderColor = 'unset';
      dom.style.borderRightStyle = 'solid';
      dom.style.borderWidth = '3px';

      dom.classList.add('result-trigger');
      dom.addEventListener('click', () => {
        typeof selectQRCode === 'function' && selectQRCode(resultItem);
      });
      qrCodePreviewWrapper.value?.appendChild(dom);
    });
  };

  /**
   * 扫描图片（canvas）
   *
   * @param {File} [file] 图片文件信息
   * @return {*}  {(Promise<any | null>)}
   */
  const scanImageByCanvas = async (file?: File): Promise<ScanResult[] | null> => {
    if (!file) {
      return Promise.resolve(null);
    }

    // 读取加载图片
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
    });
    reader.readAsDataURL(file);
    const dataurl = await promise;
    const img = new Image();
    img.src = dataurl as string;
    await new Promise<void>((resolve) => {
      img.onload = () => resolve();
    });
    qrCodePreview.value!.width = img.width;
    qrCodePreview.value!.height = img.height;
    qrCodePreview.value!.getContext('2d')!.drawImage(img, 0, 0);

    // 创建识别二维码 canvas
    const MAX_WIDTH = 500;
    const { width, height } = img;
    const canvas = document.createElement('canvas');
    canvas.width = MAX_WIDTH;
    canvas.height = (MAX_WIDTH * height) / width;
    const ctx = canvas.getContext('2d')!;
    ctx.filter = 'grayscale(100%) contrast(200%) brightness(100%)';
    ctx.drawImage(img, 0, 0, width, height, 0, 0, MAX_WIDTH, canvas.height);

    // 清空之前的结果 & 相关 DOM 节点
    resultList.length = 0;
    removeNodes(qrCodePreviewWrapper.value!, '.result-trigger');

    try {
      for (let i = 0; i < scanCount; i++) {
        const result = await scan(canvas, { includeRectCanvas: true });
        if (!result?.rect || !result.text) {
          continue;
        }

        // resultList.set(result.text, result.rect);
        resultList.push(result);

        // 绘制遮挡区域
        const { x, y, height, width } = result.rect;
        ctx.fillRect(x, y, width, height);
      }

      if (resultList.length === 0) {
        return Promise.resolve(null);
      }

      if (resultList.length === 1) {
        typeof selectQRCode === 'function' && selectQRCode(resultList[0]);
      } else {
        // 二维码在视图中的缩放比
        const previewRect = qrCodePreview.value?.getBoundingClientRect();
        const previewScale = parseFloat(((previewRect?.width ?? 0) / img.width).toFixed(2));

        // 二维码在扫描识别中的缩放比
        const scanScale = parseFloat((MAX_WIDTH / width).toFixed(2));

        _drawSelectQRCodeTrigger(scanScale, previewScale);
      }

      return resultList;
    } catch (err) {
      console.error('识别失败', err);
      return Promise.reject(err);
    }
  };

  /**
   * 摄像头识别
   *
   * TODO:
   *
   * @return {*}
   */
  const scanWithVideo = async () => {
    if (!qrCodeScanVideo.value) {
      return;
    }

    // 检查媒体设备
    const navigator = window.navigator.mediaDevices;
    const devices = await navigator.enumerateDevices();
    if (!devices) {
      return;
    }

    const stream = await navigator.getUserMedia({
      audio: false,
      video: {
        width: 300,
        height: 300,
        // facingMode: { exact: "environment" }, //强制后置摄像头
        facingMode: 'user' //前置摄像头
      }
    });
    qrCodeScanVideo.value.srcObject = stream;
    // qrCodeScanVideo.value.play();
  };

  return {
    qrCodeScanVideo,
    qrCodePreviewWrapper,
    qrCodePreview,
    readyScan,
    scanWithVideo,
    scanImageByCanvas
  };
}

/**
 * 删除 DOM 节点
 *
 * @param {HTMLElement} parentEle
 * @param {string} childClassName
 * @return {*}  {void}
 */
const removeNodes = (parentEle: HTMLElement, childClassName: string): void => {
  const nodes = parentEle?.querySelectorAll(childClassName);
  if (!nodes) {
    return;
  }

  nodes.forEach((ele) => parentEle?.removeChild(ele));
};

/**
 * 设置行内样式
 *
 * @param {HTMLElement} ele
 * @param {Partial<CSSStyleDeclaration>} styles
 */
const setInlineStyle = (ele: HTMLElement, styles: Partial<CSSStyleDeclaration>) => {
  for (const [key, value] of Object.entries(styles)) {
    if (value) {
      ele.style.setProperty(key as string, `${value}`);
    }
  }
};
