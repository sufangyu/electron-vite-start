<template>
  <AppMain title="二维码识别">
    <section class="p-3">
      <Card title="二维码识别">
        <el-upload
          accept="image/*"
          :before-upload="() => false"
          :show-file-list="false"
          @change="handleChange"
        >
          <el-button :icon="ScanCode" type="primary">选择二维码</el-button>
        </el-upload>
        <p class="text-xs mt-2 opacity-50">
          更完善扫描二维码推荐使用: https://github.com/mebjas/html5-qrcode
        </p>

        <el-alert
          :title="`识别结果：${resultText}`"
          type="success"
          :closable="false"
          class="mt-4"
        />

        <!-- 图片 -->
        <div ref="qrCodePreviewWrapper" class="qrcode-preview">
          <canvas ref="qrCodePreview" class="w-[200px]" />
          <div v-show="(result ?? []).length > 1" class="qrcode-preview-overlay">
            <span>识别到多个, 请选择一个</span>
          </div>
        </div>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { ScanCode } from '@icon-park/vue-next';
import { ElMessage, UploadFile } from 'element-plus';
import { ScanResult } from 'qr-scanner-wechat';

import { useQRCodeScan } from '../composables';

const result = ref<ScanResult[] | null>(null);
const resultText = ref('');

const { qrCodePreviewWrapper, qrCodePreview, readyScan, scanImageByCanvas } = useQRCodeScan({
  selectQRCode(result) {
    resultText.value = result.text ?? '';
  }
});

const handleChange = async (uploadFile: UploadFile) => {
  resultText.value = '';
  result.value = null;
  const file = uploadFile.raw as File;
  result.value = await scanImageByCanvas(file);

  const message = result.value ? '识别成功' : '无法识别';
  ElMessage.success({ message, grouping: true });

  if (result.value?.length === 1) {
    resultText.value = result?.[0].text ?? '';
  }
};

onMounted(async () => {
  await readyScan();
});
</script>

<style lang="scss" scoped>
.qrcode-preview {
  @apply relative inline-flex;

  &-overlay {
    @apply absolute top-0 right-0 left-0 bottom-0 bg-black/70 text-center;

    > span {
      @apply inline-block text-xs absolute right-0 left-0 bottom-3;
    }
  }

  .result-trigger {
    // FIXME: 无效
    animation: scaleAnimation 2s linear 2s infinite alternate;
  }
}

@keyframes scaleAnimation {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.5);
  }
}
</style>
