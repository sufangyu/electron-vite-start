<template>
  <div ref="domToImageRef" class="dom-to-image">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import DomToImage from 'dom-to-image-more';
import { ElLoading, ElMessage } from 'element-plus';
import { type LoadingInstance } from 'element-plus/es/components/loading/src/loading';
import { merge } from 'lodash-es';

import { GenerateImageConfig, GenerateImageOptops, GenerateImageType } from './types';

const domToImageRef = ref<Element | null>(null);
// 生成图片方法映射
const domToImageFuncMap: Record<
  GenerateImageType,
  (node: Node, options?: GenerateImageConfig) => Promise<string | Blob | Uint8ClampedArray>
> = {
  svg: DomToImage.toSvg,
  png: DomToImage.toPng,
  jpeg: DomToImage.toJpeg,
  bolb: DomToImage.toBolb,
  pixel: DomToImage.toPixelData
};

/**
 * 生成图片
 * @param options 导出配置
 */
const generateToImage = async (
  options?: GenerateImageOptops
): Promise<string | Blob | Uint8ClampedArray | null> => {
  if (!domToImageRef.value) {
    ElMessage.warning({ message: '内容未渲染', grouping: true });
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
  let loadingInstance: LoadingInstance | null = null;

  try {
    loadingInstance = ElLoading.service({
      lock: true,
      text: loadingText
    });

    const { width, height } = domToImageRef.value!.getBoundingClientRect();
    const imgScale = config.scale ?? 2;
    const imgWidth = config.width ?? width;
    const imgHeight = config.height ?? height;
    const mergeConfig: GenerateImageConfig = merge({ bgcolor: '#fff' }, config, {
      scale: imgScale,
      width: imgWidth,
      height: imgHeight,
      style: {
        ...(config.style ?? {})
      }
    });

    result = await domToImageFuncMap[type](domToImageRef.value!, mergeConfig);
    ElMessage.success({ message: successText, grouping: true });
  } catch (err) {
    console.error('生成失败', err);
    ElMessage.success({ message: errorText, grouping: true });
  } finally {
    loadingInstance?.close();
  }

  return Promise.resolve(result);
};

defineExpose({
  generateToImage
});
</script>

<style lang="scss" scoped>
// fix: 修复使用 tailwind 会有额外的边框、背景色
*,
:after,
:before,
:deep(*, :after, :before) {
  border-style: none;
  box-sizing: border-box;
}
</style>
