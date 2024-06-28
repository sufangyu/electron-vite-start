<template>
  <AppMain title="二维码生成器">
    <section class="qr-generator">
      <div class="qr-config">
        <el-scrollbar style="height: 100%">
          <el-form :model="qrCodeForm" label-width="96px" size="small">
            <h4 class="text-sm my-4">基础配置</h4>
            <el-form-item label="文本内容">
              <el-input v-model="qrCodeForm.data" placeholder="请输入二维码内容" />
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="宽度">
                  <el-input v-model="qrCodeForm.width" placeholder="请输入宽度" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="高度">
                  <el-input v-model="qrCodeForm.height" placeholder="请输入高度" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="码边距">
              <template #label="{ label }">
                <span class="flex items-center">
                  <span class="mr-1">{{ label }}</span>
                  <el-tooltip content="二维码图案距离四周的边距" placement="top">
                    <Help />
                  </el-tooltip>
                </span>
              </template>
              <el-input v-model="qrCodeForm.margin" placeholder="请输入边距" />
            </el-form-item>
            <el-form-item label="码点数量">
              <el-input-number
                v-model="qrCodeForm.qrOptions!.typeNumber"
                :min="0"
                :max="40"
                :step="1"
                controls-position="right"
              />
            </el-form-item>
            <!-- <el-form-item label="mode">
                <el-input v-model="qrCodeForm.qrOptions!.mode" />
              </el-form-item> -->
            <el-form-item>
              <template #label>
                <span class="flex items-center">
                  <span class="mr-1">容错率</span>
                  <el-tooltip
                    content="容错率设置越高，可在遮挡越多的情况下被扫描出来。"
                    placement="top"
                  >
                    <Help />
                  </el-tooltip>
                </span>
              </template>
              <el-select v-model="qrCodeForm.qrOptions!.errorCorrectionLevel">
                <el-option value="L" label="7%">7%</el-option>
                <el-option value="M" label="15%">15%</el-option>
                <el-option value="Q" label="25%">25%</el-option>
                <el-option value="H" label="30%">30%</el-option>
              </el-select>
            </el-form-item>

            <el-divider />
            <h4 class="text-sm my-4">LOGO图配置</h4>
            <el-form-item label="LOGO图">
              <!-- TODO: 支持上传图片 -->
              <el-input v-model="qrCodeForm.image" placeholder="请输入二维码内容" />
            </el-form-item>
            <el-form-item label="尺寸缩放">
              <el-input-number
                v-model="qrCodeForm.imageOptions!.imageSize"
                :min="0"
                :max="1"
                :step="0.1"
                controls-position="right"
              />
            </el-form-item>
            <el-form-item label="边距">
              <el-input v-model="qrCodeForm.imageOptions!.margin" placeholder="请输入边距" />
            </el-form-item>

            <el-form-item label="隐藏背景内容">
              <el-switch v-model="qrCodeForm.imageOptions!.hideBackgroundDots" />
            </el-form-item>

            <el-divider />
            <h4 class="text-sm my-4">码点配置</h4>
            <el-form-item label="码点形状">
              <el-select v-model="qrCodeForm.dotsOptions!.type">
                <el-option
                  v-for="item in dotTypeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="颜色类型">
              <el-radio-group
                v-model="dotsOptionsColorType"
                size="small"
                @change="(val) => handleColorTypeChange(val, 'dotsOptions')"
              >
                <el-radio-button
                  v-for="item in colorTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-radio-group>
            </el-form-item>

            <!-- 单色 -->
            <template v-if="dotsOptionsColorType === ColorType.单色">
              <el-form-item label="选择颜色">
                <input v-model="qrCodeForm.dotsOptions!.color" type="color" />
              </el-form-item>
            </template>
            <!-- 渐变 -->
            <template
              v-if="dotsOptionsColorType === ColorType.渐变 && qrCodeForm.dotsOptions!.gradient"
            >
              <el-form-item label="渐变类型">
                <el-radio-group v-model="qrCodeForm.dotsOptions!.gradient!.type" size="small">
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="设置渐变">
                <input
                  v-model="qrCodeForm.dotsOptions!.gradient!.colorStops[0].color"
                  type="color"
                />
                <input
                  v-model="qrCodeForm.dotsOptions!.gradient!.colorStops[1].color"
                  class="ml-2"
                  type="color"
                />
              </el-form-item>
              <el-form-item label="旋转角度">
                <el-input
                  v-model="qrCodeForm.dotsOptions!.gradient!.rotation"
                  placeholder="请输入"
                />
              </el-form-item>
            </template>

            <el-divider />
            <h4 class="text-sm my-4">码眼边框配置</h4>
            <el-form-item label="形状">
              <el-select v-model="qrCodeForm.cornersSquareOptions!.type">
                <el-option
                  v-for="item in cornerSquareTypeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="颜色类型">
              <el-radio-group
                v-model="cornersSquareOptionsColorType"
                size="small"
                @change="(val) => handleColorTypeChange(val, 'cornersSquareOptions')"
              >
                <el-radio-button
                  v-for="item in colorTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-radio-group>
            </el-form-item>
            <!-- 单色 -->
            <template v-if="cornersSquareOptionsColorType === ColorType.单色">
              <el-form-item label="选择颜色">
                <input v-model="qrCodeForm.cornersSquareOptions!.color" type="color" />
              </el-form-item>
            </template>
            <!-- 渐变 -->
            <template
              v-if="
                cornersSquareOptionsColorType === ColorType.渐变 &&
                qrCodeForm.cornersSquareOptions!.gradient
              "
            >
              <el-form-item label="渐变类型">
                <el-radio-group
                  v-model="qrCodeForm.cornersSquareOptions!.gradient!.type"
                  size="small"
                >
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="设置渐变">
                <input
                  v-model="qrCodeForm.cornersSquareOptions!.gradient!.colorStops[0].color"
                  type="color"
                />
                <input
                  v-model="qrCodeForm.cornersSquareOptions!.gradient!.colorStops[1].color"
                  class="ml-2"
                  type="color"
                />
              </el-form-item>
              <el-form-item label="旋转角度">
                <el-input
                  v-model="qrCodeForm.cornersSquareOptions!.gradient!.rotation"
                  placeholder="请输入"
                />
              </el-form-item>
            </template>

            <el-divider />
            <h4 class="text-sm my-4">码眼点配置</h4>
            <el-form-item label="形状">
              <el-select v-model="qrCodeForm.cornersDotOptions!.type">
                <el-option
                  v-for="item in cornerDotTypeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="颜色类型">
              <el-radio-group
                v-model="cornersDotOptionsColorType"
                size="small"
                @change="(val) => handleColorTypeChange(val, 'cornersDotOptions')"
              >
                <el-radio-button
                  v-for="item in colorTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-radio-group>
            </el-form-item>
            <!-- 单色 -->
            <template v-if="cornersDotOptionsColorType === ColorType.单色">
              <el-form-item label="选择颜色">
                <input v-model="qrCodeForm.cornersDotOptions!.color" type="color" />
              </el-form-item>
            </template>
            <!-- 渐变 -->
            <template
              v-if="
                cornersDotOptionsColorType === ColorType.渐变 &&
                qrCodeForm.cornersDotOptions!.gradient
              "
            >
              <el-form-item label="渐变类型">
                <el-radio-group v-model="qrCodeForm.cornersDotOptions!.gradient!.type" size="small">
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="设置渐变">
                <input
                  v-model="qrCodeForm.cornersDotOptions!.gradient!.colorStops[0].color"
                  type="color"
                />
                <input
                  v-model="qrCodeForm.cornersDotOptions!.gradient!.colorStops[1].color"
                  class="ml-2"
                  type="color"
                />
              </el-form-item>
              <el-form-item label="旋转角度">
                <el-input
                  v-model="qrCodeForm.cornersDotOptions!.gradient!.rotation"
                  placeholder="请输入"
                />
              </el-form-item>
            </template>

            <el-divider />
            <h4 class="text-sm my-4">背景色配置</h4>
            <el-form-item label="颜色类型">
              <el-radio-group
                v-model="backgroundColorType"
                size="small"
                @change="(val) => handleColorTypeChange(val, 'backgroundOptions')"
              >
                <el-radio-button
                  v-for="item in colorTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-radio-group>
            </el-form-item>
            <!-- 单色 -->
            <template v-if="backgroundColorType === ColorType.单色">
              <el-form-item label="选择颜色">
                <input v-model="qrCodeForm.backgroundOptions!.color" type="color" />
              </el-form-item>
            </template>
            <!-- 渐变 -->
            <template
              v-if="
                backgroundColorType === ColorType.渐变 && qrCodeForm.backgroundOptions!.gradient
              "
            >
              <el-form-item label="渐变类型">
                <el-radio-group v-model="qrCodeForm.backgroundOptions!.gradient!.type" size="small">
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item label="设置渐变">
                <input
                  v-model="qrCodeForm.backgroundOptions!.gradient!.colorStops[0].color"
                  type="color"
                />
                <input
                  v-model="qrCodeForm.backgroundOptions!.gradient!.colorStops[1].color"
                  class="ml-2"
                  type="color"
                />
              </el-form-item>
              <el-form-item label="旋转角度">
                <el-input
                  v-model="qrCodeForm.backgroundOptions!.gradient!.rotation"
                  placeholder="请输入"
                />
              </el-form-item>
            </template>
          </el-form>
        </el-scrollbar>
      </div>

      <!-- 预览 & 下载 -->
      <div class="qr-preview">
        <div>
          <div id="qr-image" ref="previewRef" class="qr-image"></div>
          <div class="qr-actions">
            <div class="flex gap-1">
              <el-select v-model="extension">
                <el-option v-for="ext in ['PNG', 'SVG', 'JPEG', 'WEBP']" :key="ext" :value="ext">
                  {{ ext }}
                </el-option>
              </el-select>
              <el-button type="primary" @click="downloadQRCode">下载图片</el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { Help } from '@icon-park/vue-next';

import { useQRCodeCustom, ColorType } from '../composables';

const previewRef = ref<HTMLElement | null>(null);
const {
  colorTypeOptions,
  handleColorTypeChange,
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
  // 下载
  extension,
  downloadQRCode
} = useQRCodeCustom({
  previewElementId: 'qr-image'
});

onMounted(() => {
  // fix: 延迟执行, 解决 vite 热更新 DOM 获取 null 问题
  setTimeout(() => createQRCode(), 100);
});
</script>

<style lang="scss" scoped>
.qr-generator {
  @apply flex p-4;
  height: calc(100vh - 48px);
}

.qr-config {
  @apply flex-1 overflow-auto h-[100%];
}

.qr-preview {
  @apply w-80 ml-4 p-4 text-center flex justify-center items-center
    bg-gray-200
    dark:bg-neutral-900;

  .qr-image {
    @apply w-52 h-52 bg-slate-300 m-auto;
  }

  .qr-actions {
    @apply mt-4;
  }
}
</style>
