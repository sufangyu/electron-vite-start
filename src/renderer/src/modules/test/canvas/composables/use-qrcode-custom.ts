import { cloneDeep } from 'lodash-es';
import QRCodeStyling, {
  type Options,
  type Extension,
  type DotType,
  type GradientType,
  type CornerSquareType,
  type CornerDotType
} from 'styled-qr-code';

export function useQRCodeCustom(options: UseQRCodeCustomOptions) {
  const qrCodeForm = ref<QRCodeForm>({
    data: 'https://qr-code-styling.com',
    width: 480,
    height: 480,
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: 'Q'
    },
    image:
      'https://meihua.oss-cn-hangzhou.aliyuncs.com/cli/images/beautify/new/logo/%E7%9F%A5%E4%B9%8E-0210.png',
    imageOptions: {
      hideBackgroundDots: true,
      crossOrigin: 'anonymous',
      imageSize: 0.5,
      margin: 20
    },
    // 码点配置
    dotsOptions: {
      type: 'rounded',
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
      type: 'extra-rounded',
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
      type: 'dot',
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
    }
  });

  // 颜色类型 ----------------------------------------------------------------------------
  const colorTypeOptions = [
    { label: '单色', value: 'single' },
    { label: '渐变', value: 'gradient' }
  ];
  /**
   * 切换颜色类型
   *
   * @param {('single' | 'gradient')} type 颜色类型
   * @param {'dotsOptions'} key 更新的属性 key
   */
  const handleColorTypeChange = (
    type: 'single' | 'gradient',
    key: 'dotsOptions' | 'cornersSquareOptions' | 'cornersDotOptions' | 'backgroundOptions'
  ) => {
    if (type === 'single') {
      delete qrCodeForm.value[key]?.gradient;
      qrCodeForm.value[key]!.color = '#000000';
    } else if (type === 'gradient') {
      delete qrCodeForm.value[key]?.color;
      qrCodeForm.value[key]!.gradient = {
        type: 'linear',
        rotation: 0,
        colorStops: [
          { offset: 0, color: key === 'backgroundOptions' ? '#ffffff' : '#000000' },
          { offset: 1, color: key === 'backgroundOptions' ? '#ffffff' : '#000000' }
        ]
      };
    }
  };
  const gradientOptions: { label: string; value: GradientType }[] = [
    { label: '线性', value: 'linear' },
    { label: '径向', value: 'radial' }
  ];

  const dotsOptionsColorType = ref<ColorType>(ColorType.单色);
  const cornersSquareOptionsColorType = ref<ColorType>(ColorType.单色);
  const cornersDotOptionsColorType = ref<ColorType>(ColorType.单色);
  const backgroundColorType = ref<ColorType>(ColorType.单色);

  let qrCode: QRCodeStyling | null = null;
  let $previewEle: HTMLElement | null = null;

  // 码点类型 ----------------------------------------------------------------------------
  const dotTypeOptions: { label: string; value: DotType }[] = [
    { label: '圆点', value: 'dots' },
    { label: '圆角', value: 'rounded' },
    { label: '单圆角矩形', value: 'classy' },
    { label: '大单圆角矩形', value: 'classy-rounded' },
    { label: '方形', value: 'square' },
    { label: '液态', value: 'extra-rounded' }
  ];

  // 码眼边框类型
  const cornerSquareTypeOptions: { label: string; value: CornerSquareType }[] = [
    { label: '方形', value: 'square' },
    { label: '圆形', value: 'dot' },
    { label: '圆角', value: 'extra-rounded' }
  ];
  // 码眼点类型
  const cornerDotTypeOptions: { label: string; value: CornerDotType }[] = [
    { label: '方形', value: 'square' },
    { label: '圆形', value: 'dot' }
  ];

  // 创建二维码
  const createQRCode = (qrCodeOptions?: Options) => {
    qrCode = new QRCodeStyling(qrCodeOptions ?? qrCodeForm.value);

    !$previewEle && ($previewEle = document.getElementById(options.previewElementId)!);
    $previewEle.innerHTML = '';
    qrCode.append($previewEle);
    $previewEle?.querySelector('canvas')?.setAttribute('style', 'width: 100%; height: 100%');
  };

  // 更新二维码
  const updateQRCode = () => {
    const qrCodeOptions = cloneDeep(qrCodeForm.value);
    // console.log('更新二维码', options);
    // fix: 重新创建, 解决颜色类型响应无效问题
    createQRCode(qrCodeOptions);
  };

  watch(
    () => qrCodeForm,
    () => {
      updateQRCode();
    },
    { deep: true }
  );

  // 下载
  const extension = ref<'PNG' | 'SVG' | 'JPEG' | 'WEBP'>('PNG');
  const downloadQRCode = async () => {
    await qrCode?.download({
      // name: '',
      extension: extension.value.toLocaleLowerCase() as Extension
    });
  };

  return {
    handleColorTypeChange,
    colorTypeOptions,
    gradientOptions,
    dotTypeOptions,
    dotsOptionsColorType,
    cornerSquareTypeOptions,
    cornersSquareOptionsColorType,
    cornerDotTypeOptions,
    cornersDotOptionsColorType,
    backgroundColorType,
    qrCodeForm,
    createQRCode,
    extension,
    downloadQRCode
  };
}

export interface UseQRCodeCustomOptions {
  previewElementId: string;
}

export interface QRCodeForm extends Options {}

export enum ColorType {
  单色 = 'single',
  渐变 = 'gradient'
}
