<template>
  <div ref="qrcodeRef" class="qrcode"></div>
</template>

<script lang="ts" setup>
import { Props } from './types';
import { useRQCode } from './use-qrcode';

const props = withDefaults(defineProps<Props>(), {
  data: '',
  width: 400,
  height: 400,
  type: 'canvas'
});

const { qrcodeRef, updateQRCode, downloadQRCode } = useRQCode({
  ...props
});

watch(
  () => props,
  (newVal) => {
    updateQRCode({
      ...newVal
    });
  },
  { deep: true }
);

defineExpose({
  downloadQRCode
});
</script>

<style lang="scss" scoped>
.qrcode {
  @apply inline-block;
}
</style>
