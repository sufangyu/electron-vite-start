<template>
  <section class="signature-wrapper">
    <div ref="canvasWrapperRef" class="signature-canvas-wrapper">
      <canvas
        ref="canvasCacheRef"
        class="signature__canvas signature__canvas--cache"
        :style="{
          height: `${height}px`,
          backgroundColor
        }"
      />

      <canvas
        ref="canvasRef"
        class="signature__canvas"
        :style="{
          height: `${height}px`
        }"
      />
    </div>

    <div class="signature__toolbar">
      <el-button size="small" type="default" @click="() => download()">下载</el-button>
      <el-button size="small" type="danger" @click="redraw">重写</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Props } from './types';
import { useSignature } from './use-signature';

const props = withDefaults(defineProps<Props>(), {
  height: 250,
  backgroundColor: '#ffffff'
});

// 支持横屏竖屏可以使用两套布局方案切换解决
const { canvasWrapperRef, canvasRef, canvasCacheRef, redraw, getBase64, download } = useSignature({
  height: props.height,
  size: props.size,
  ratio: props.ratio,
  color: props.color,
  backgroundColor: props.backgroundColor
});

const handleSubmit = () => {
  const base64 = getBase64();
  console.log(base64);
};
</script>

<style lang="scss" scoped>
.signature-wrapper {
  .signature-canvas-wrapper {
    @apply relative rounded-xl box-content cursor-crosshair;
    border: 2px dashed #ccc;
  }

  .signature__canvas {
    @apply w-full rounded-xl;

    position: absolute;
    left: 0;
    top: 0;
  }

  .signature__toolbar {
    @apply mt-2 flex justify-center;
  }
}
</style>
