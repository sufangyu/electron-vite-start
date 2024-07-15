import { getStroke } from 'perfect-freehand';

import { Options } from './types';

/**
 * 获取 canvas 上下文
 *
 * @param {(HTMLCanvasElement | null)} [canvasEle]
 * @param {number} [ratio=1]
 * @return {*}
 */
const getContextCanvas = (
  canvasEle?: HTMLCanvasElement | null,
  ratio = 1
): CanvasRenderingContext2D | null => {
  if (!canvasEle) {
    return null;
  }
  const { width, height } = canvasEle.getBoundingClientRect();
  // FIXME: 浏览器窗口有调整后, 会有坐标轴不准确问题, 需要重写
  canvasEle.width = width * ratio;
  canvasEle.height = height * ratio;
  const curCtx = canvasEle.getContext('2d');
  curCtx?.scale(ratio, ratio);
  return curCtx;
};

const average = (a: number, b: number) => (a + b) / 2;

/**
 * 将点数组转换成 svg 路径字符串
 *
 * @param {[number, number][]} points
 * @return {*}
 */
const getSvgPathFromStroke = (points: number[][]) => {
  const len = points.length;
  if (len < 4) {
    return '';
  }
  let a = points[0];
  let b = points[1];
  const c = points[2];
  let result = `M${a[0]},${a[1]} Q${b[0]},${b[1]} ${average(b[0], c[0])},${average(b[1], c[1])} T`;
  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0])},${average(a[1], b[1])} `;
  }
  result += 'Z';
  return result;
};

/**
 * 是否是手机/平板端
 */
const isMobile = (() => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /android/i.test(userAgent);
  const hasTouchEvent = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isIPad = /Macintosh/.test(userAgent) && hasTouchEvent;
  return isIOS || isAndroid || hasTouchEvent || isIPad;
})();

/**
 * 签名
 *
 * @export
 * @param {Options} [options]
 * @see https://juejin.cn/post/7383268946820120591
 * @return {*}
 */
export function useSignature(options?: Options) {
  const { size, color, backgroundColor, ratio, height } = {
    height: options?.height ?? 250,
    size: options?.size ?? 4,
    ratio: Math.max(window.devicePixelRatio, 2),
    color: options?.color ?? 'black',
    backgroundColor: options?.backgroundColor ?? 'white'
  } as Options;

  const canvasWrapperRef = ref<HTMLElement | null>(null);
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const canvasCacheRef = ref<HTMLCanvasElement | null>(null);
  let ctx: CanvasRenderingContext2D | null = null;
  let ctxCache: CanvasRenderingContext2D | null = null;

  let isMousedown = false;
  // 坐标轴集合
  let pointList: { x: number; y: number }[] = [];
  let line: Path2D | null = null;
  const lineList: Path2D[] = [];

  /**
   * 获取当前鼠标在 canvas 的坐标轴
   *
   * @param {MouseEvent} ev
   * @return {*}  {{ x: number; y: number }}
   */
  const getCurrentPoint = (ev: MouseEvent | TouchEvent): { x: number; y: number } => {
    const rect = canvasRef.value!.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if (ev instanceof MouseEvent) {
      clientX = ev.clientX;
      clientY = ev.clientY;
    } else if (ev instanceof TouchEvent) {
      clientX = ev.touches[0].clientX;
      clientY = ev.touches[0].clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
  };

  /**
   * 重置画布
   *
   * @param {(HTMLCanvasElement | null)} [canvasEle]
   * @param {number} [ratio=1]
   */
  const clearCanvas = (canvasEle?: HTMLCanvasElement | null, ratio: number = 1) => {
    if (!canvasEle) {
      return;
    }

    const { width, height } = canvasEle.getBoundingClientRect();
    const canvasWidth = width * ratio;
    const canvasHeight = height * ratio;
    const curCtx = canvasEle.getContext('2d');
    curCtx?.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  const onDrawStart = (ev: MouseEvent | TouchEvent) => {
    isMousedown = true;
    pointList = [];

    // 线条颜色
    ctx!.fillStyle = color!;
    ctxCache!.fillStyle = color!;

    pointList.push(getCurrentPoint(ev));
  };

  const onDrawMove = (ev: MouseEvent | TouchEvent) => {
    if (!isMousedown) {
      return;
    }

    pointList.push(getCurrentPoint(ev));

    // 清除重新绘制, 解决图形存在明显的锯齿问题
    clearCanvas(canvasRef.value);

    const points = getStroke(pointList, {
      size,
      thinning: 0.5,
      smoothing: 0.5,
      streamline: 0.5,
      // simulatePressure: true,
      start: {
        cap: true,
        taper: 0,
        easing: (t) => t
      },
      end: {
        cap: true,
        taper: 0,
        easing: (t) => t
      }
    });
    const pathData = getSvgPathFromStroke(points);
    const path = new Path2D(pathData);
    line = path;
    ctx?.fill(path);
  };

  const onDrawEnd = () => {
    isMousedown = false;
    line && lineList.push(line);

    // 绘制完成后就将图形绘制到缓存的 canvas 画布上
    clearCanvas(canvasRef.value, ratio);
    clearCanvas(canvasCacheRef.value, ratio);
    lineList.forEach((item) => {
      ctxCache?.fill(item);
    });
  };

  /**
   * 重新绘制画布
   *
   */
  const redraw = () => {
    ctx = getContextCanvas(canvasRef.value, ratio);
    ctxCache = getContextCanvas(canvasCacheRef.value, ratio);

    clearCanvas(canvasRef.value, ratio);
    clearCanvas(canvasCacheRef.value, ratio);
    line = null;
    lineList.length = 0;
  };

  /**
   * 获取 canvas 的 base64 数据
   *
   * @param {string} [type='image/png'] 数据类型
   * @param {number} [quality=1] 图片质量
   * @return {*}  {(string | undefined)}
   */
  const getBase64 = (type?: string | undefined, quality?: number): string => {
    if (!canvasCacheRef.value) {
      return '';
    }

    // 创建临时 canvas 原来绘制背景色和签名内容
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const { width, height } = canvasCacheRef.value.getBoundingClientRect();
    const canvasWidth = width * ratio!;
    const canvasHeight = height * ratio!;
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    // 绘制背景色
    tempCtx!.fillStyle = backgroundColor!;
    tempCtx!.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制签名内容
    tempCtx!.drawImage(canvasCacheRef.value, 0, 0, canvasWidth, canvasHeight);
    return tempCanvas.toDataURL(type, quality);
  };

  /**
   * 下载 canvas 图片
   *
   * @param {string} filename 文件名, 默认为时间戳
   * @return {*}
   */
  const download = (filename?: string): void => {
    if (!canvasCacheRef.value) {
      return;
    }

    const curFilename = typeof filename === 'string' ? filename : `${Date.now()}`;
    const el = document.createElement('a');
    el.href = getBase64();
    el.download = curFilename;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  onMounted(() => {
    ctx = getContextCanvas(canvasRef.value, ratio);
    ctxCache = getContextCanvas(canvasCacheRef.value, ratio);
    canvasWrapperRef.value!.style.height = `${height}px`;
    canvasWrapperRef.value!.style.touchAction = 'none';

    if (isMobile) {
      canvasRef.value?.addEventListener('touchstart', onDrawStart, { passive: false });
      window.addEventListener('touchmove', onDrawMove, { passive: false });
      window.addEventListener('touchend', onDrawEnd, { passive: false });
      window.addEventListener('touchcancel', onDrawEnd, { passive: false });
    } else {
      canvasRef.value?.addEventListener('mousedown', onDrawStart);
      window.addEventListener('mousemove', onDrawMove);
      window.addEventListener('mouseup', onDrawEnd);
    }
  });

  onUnmounted(() => {
    if (isMobile) {
      canvasRef.value?.removeEventListener('touchstart', onDrawStart);
      window.removeEventListener('touchmove', onDrawMove);
      window.removeEventListener('touchend', onDrawEnd);
      window.removeEventListener('touchcancel', onDrawEnd);
    } else {
      canvasRef.value?.removeEventListener('mousedown', onDrawStart);
      window.removeEventListener('mousemove', onDrawMove);
      window.removeEventListener('mouseup', onDrawEnd);
    }
  });

  return {
    canvasWrapperRef,
    canvasRef,
    canvasCacheRef,
    redraw,
    getBase64,
    download
  };
}
