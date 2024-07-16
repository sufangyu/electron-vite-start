<template>
  <AppMain title="二维码">
    <div class="p-3">
      <Card title="基础配置">
        <el-row :gutter="10">
          <el-col :span="6" class="text-center">
            <QRCode :data="qrCodeData" />
            <el-form-item label="内容:" size="small" class="mt-2">
              <el-input v-model="qrCodeText" placeholder="-" />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode data="https://qr-code-styling.com/" :margin="qrMargin" />
            <el-form-item label="码边距:" size="small" class="mt-2">
              <template #label="{ label }">
                <span class="flex items-center">
                  <span class="mr-1">{{ label }}</span>
                  <el-tooltip content="二维码图案距离四周的边距" placement="top">
                    <Help />
                  </el-tooltip>
                </span>
              </template>

              <el-input-number
                v-model="qrMargin"
                size="small"
                :min="0"
                :max="100"
                placeholder="请输入数字"
                controls-position="right"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode data="https://qr-code-styling.com/" :width="qrSize" :height="qrSize" />
            <el-form-item label="尺寸:" size="small" class="mt-2">
              <el-button-group>
                <el-button @click="decline">-</el-button>
                <el-button @click="increase">+</el-button>
              </el-button-group>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :qr-options="{ errorCorrectionLevel: errorCorrectionLevel }"
            />
            <el-form-item label="容错率" size="small" class="mt-2">
              <template #label="{ label }">
                <span class="flex items-center">
                  <span class="mr-1">{{ label }}</span>
                  <el-tooltip
                    content="容错率设置越高，可在遮挡越多的情况下被扫描出来。"
                    placement="top"
                  >
                    <Help />
                  </el-tooltip>
                  <span class="ml-1">:</span>
                </span>
              </template>

              <el-select v-model="errorCorrectionLevel">
                <el-option value="L" label="7%" />
                <el-option value="M" label="15%" />
                <el-option value="Q" label="25%" />
                <el-option value="H" label="30%" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </Card>

      <Card title="LOGO 图配置">
        <el-row :gutter="10">
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              image="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
            />
            <p class="text-xs mt-2">默认配置</p>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              image="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              :image-options="{
                imageSize: imageSize,
                margin: 4
              }"
            />
            <el-form-item label="缩放比例:" size="small" class="mt-2">
              <template #label="{ label }">
                <span class="flex items-center">
                  <span class="mr-1">{{ label }}</span>
                  <el-tooltip content="0~1的缩放比例" placement="top">
                    <Help />
                  </el-tooltip>
                </span>
              </template>

              <el-input-number
                v-model="imageSize"
                size="small"
                :min="0"
                :max="1"
                :step="0.1"
                placeholder="请输入数字"
                controls-position="right"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              image="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              :image-options="{
                margin: imageMargin
              }"
            />
            <el-form-item label="边距:" size="small" class="mt-2">
              <el-input-number
                v-model="imageMargin"
                size="small"
                :min="0"
                :max="16"
                :step="1"
                placeholder="请输入数字"
                controls-position="right"
                :controls="false"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              image="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
              :image-options="{
                hideBackgroundDots
              }"
            />
            <el-form-item label="显示背景:" size="small" class="mt-2">
              <el-switch v-model="hideBackgroundDots" />
            </el-form-item>
          </el-col>
        </el-row>
      </Card>

      <Card title="背景色">
        <el-row :gutter="10">
          <el-col :span="12" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :background-options="{
                color: backgroundOptionsColor
              }"
            />
            <el-form-item label="单颜色:" size="small">
              <el-color-picker v-model="backgroundOptionsColor" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :background-options="{
                color: backgroundOptionsColor,
                gradient: {
                  type: backgroundOptionsGradientType,
                  rotation: backgroundOptionsGradientRotation,
                  colorStops: [
                    { offset: 0, color: backgroundOptionsGradientColor[0] },
                    { offset: 1, color: backgroundOptionsGradientColor[1] }
                  ]
                }
              }"
            />

            <el-form size="small" inline>
              <el-form-item label="渐变色:" style="margin-right: 16px">
                <el-color-picker v-model="backgroundOptionsGradientColor[0]" />
                <el-color-picker v-model="backgroundOptionsGradientColor[1]" />
              </el-form-item>
              <el-form-item label="类型" style="margin-right: 16px">
                <el-radio-group v-model="backgroundOptionsGradientType" size="small">
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="backgroundOptionsGradientType === 'linear'"
                label="角度"
                style="margin-right: 0"
              >
                <el-input-number
                  v-model="backgroundOptionsGradientRotation"
                  :min="0"
                  :max="360"
                  :controls="false"
                  style="max-width: 80px"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </Card>

      <Card title="码点配置">
        <el-row :gutter="10">
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :dots-options="{
                type: dotsOptionsType
              }"
            />
            <el-form-item label="形状:" size="small">
              <el-select v-model="dotsOptionsType">
                <el-option
                  v-for="item in dotTypeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :dots-options="{
                color: dotsOptionsColor
              }"
            />
            <el-form-item label="单颜色:" size="small">
              <el-color-picker v-model="dotsOptionsColor" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :dots-options="{
                color: dotsOptionsColor,
                gradient: {
                  type: dotsOptionsGradientType,
                  rotation: dotsOptionsGradientRotation,
                  colorStops: [
                    { offset: 0, color: dotsOptionsGradientColor[0] },
                    { offset: 1, color: dotsOptionsGradientColor[1] }
                  ]
                }
              }"
            />

            <el-form size="small" inline>
              <el-form-item label="渐变色:" style="margin-right: 16px">
                <el-color-picker v-model="dotsOptionsGradientColor[0]" />
                <el-color-picker v-model="dotsOptionsGradientColor[1]" />
              </el-form-item>
              <el-form-item label="类型" style="margin-right: 16px">
                <el-radio-group v-model="dotsOptionsGradientType" size="small">
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="dotsOptionsGradientType === 'linear'"
                label="角度"
                style="margin-right: 0"
              >
                <el-input-number
                  v-model="dotsOptionsGradientRotation"
                  :min="0"
                  :max="360"
                  :controls="false"
                  style="max-width: 80px"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </Card>

      <Card title="码眼边框配置">
        <el-row :gutter="10">
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :corners-square-options="{
                type: cornersSquareOptionsType
              }"
            />

            <el-form-item label="形状:" size="small">
              <el-select v-model="cornersSquareOptionsType">
                <el-option
                  v-for="item in cornerSquareTypeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :corners-square-options="{
                color: cornersSquareOptionsColor
              }"
            />
            <el-form-item label="单颜色:" size="small">
              <el-color-picker v-model="cornersSquareOptionsColor" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :corners-square-options="{
                color: cornersSquareOptionsColor,
                gradient: {
                  type: cornersSquareOptionsGradientType,
                  rotation: cornersSquareOptionsGradientRotation,
                  colorStops: [
                    { offset: 0, color: cornersSquareOptionsGradientColor[0] },
                    { offset: 1, color: cornersSquareOptionsGradientColor[1] }
                  ]
                }
              }"
            />

            <el-form size="small" inline>
              <el-form-item label="渐变色:" style="margin-right: 16px">
                <el-color-picker v-model="cornersSquareOptionsGradientColor[0]" />
                <el-color-picker v-model="cornersSquareOptionsGradientColor[1]" />
              </el-form-item>
              <el-form-item label="类型" style="margin-right: 16px">
                <el-radio-group v-model="cornersSquareOptionsGradientType" size="small">
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="cornersSquareOptionsGradientType === 'linear'"
                label="角度"
                style="margin-right: 0"
              >
                <el-input-number
                  v-model="cornersSquareOptionsGradientRotation"
                  :min="0"
                  :max="360"
                  :controls="false"
                  style="max-width: 80px"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </Card>

      <Card title="码眼点配置">
        <el-row :gutter="10">
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :corners-dot-options="{
                type: cornersDotOptionsType
              }"
            />

            <el-form-item label="形状:" size="small">
              <el-select v-model="cornersDotOptionsType">
                <el-option
                  v-for="item in cornerDotTypeOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :corners-dot-options="{
                color: cornersDotOptionsColor
              }"
            />
            <el-form-item label="单颜色:" size="small">
              <el-color-picker v-model="cornersDotOptionsColor" />
            </el-form-item>
          </el-col>

          <el-col :span="12" class="text-center">
            <QRCode
              data="https://qr-code-styling.com/"
              :corners-dot-options="{
                color: cornersDotOptionsColor,
                gradient: {
                  type: cornersDotOptionsGradientType,
                  rotation: cornersSquareOptionsGradientRotation,
                  colorStops: [
                    { offset: 0, color: cornersDotOptionsGradientColor[0] },
                    { offset: 1, color: cornersDotOptionsGradientColor[1] }
                  ]
                }
              }"
            />

            <el-form size="small" inline>
              <el-form-item label="渐变色:" style="margin-right: 16px">
                <el-color-picker v-model="cornersDotOptionsGradientColor[0]" />
                <el-color-picker v-model="cornersDotOptionsGradientColor[1]" />
              </el-form-item>
              <el-form-item label="类型" style="margin-right: 16px">
                <el-radio-group v-model="cornersDotOptionsGradientType" size="small">
                  <el-radio-button
                    v-for="item in gradientOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-radio-group>
              </el-form-item>
              <el-form-item
                v-if="cornersDotOptionsGradientType === 'linear'"
                label="角度"
                style="margin-right: 0"
              >
                <el-input-number
                  v-model="cornersDotOptionsGradientRotation"
                  :min="0"
                  :max="360"
                  :controls="false"
                  style="max-width: 80px"
                />
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </Card>

      <Card title="下载图片">
        <el-row :gutter="10">
          <el-col :span="12" class="text-center">
            <QRCode ref="qrCodeRef" data="https://qr-code-styling.com/" />
            <el-form-item label="内容:" size="small" class="mt-2 flex">
              <el-select v-model="extension" class="flex-1 mr-1">
                <el-option v-for="ext in ['PNG', 'SVG', 'JPEG', 'WEBP']" :key="ext" :value="ext">
                  {{ ext }}
                </el-option>
              </el-select>
              <el-button type="primary" @click="downloadQRCode">下载图片</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </Card>
    </div>
  </AppMain>
</template>

<script lang="ts" setup>
import { Help } from '@icon-park/vue-next';
import {
  type ErrorCorrectionLevel,
  type DotType,
  type GradientType,
  type CornerSquareType,
  type CornerDotType
} from 'styled-qr-code';

import QRCode from '@components/qr-code';

const gradientOptions: { label: string; value: GradientType }[] = [
  { label: '线性', value: 'linear' },
  { label: '径向', value: 'radial' }
];

// 基础配置 ------------------------------------------------------------
const qrCodeText = ref('');
const qrCodeData = computed(() => qrCodeText.value || '-');

const qrMargin = ref(4);

const qrSize = ref(400);
const MIN_SIZE = 200;
const MAX_SIZE = 600;
const increase = () => {
  const newSize = Math.min(MAX_SIZE, qrSize.value + 10);
  qrSize.value = newSize;
};
const decline = () => {
  const newSize = Math.max(MIN_SIZE, qrSize.value - 10);
  qrSize.value = newSize;
};

const errorCorrectionLevel = ref<ErrorCorrectionLevel>('M');

// LOGO ------------------------------------------------------------
const imageSize = ref(0.8);
const imageMargin = ref(4);
const hideBackgroundDots = ref(true);

// 背景色 ------------------------------------------------------------
const backgroundOptionsColor = ref<string>('#ffffff');
const backgroundOptionsGradientColor = ref<[string, string]>(['#ffffff', '#007fff']);
const backgroundOptionsGradientType = ref<GradientType>('linear');
const backgroundOptionsGradientRotation = ref(0);

// 码点配置 ------------------------------------------------------------
const dotTypeOptions: { label: string; value: DotType }[] = [
  { label: '方形', value: 'square' },
  { label: '圆点', value: 'dots' },
  { label: '圆角', value: 'rounded' },
  { label: '单圆角矩形', value: 'classy' },
  { label: '大单圆角矩形', value: 'classy-rounded' },
  { label: '液态', value: 'extra-rounded' }
];
const dotsOptionsType = ref<DotType>('square');
const dotsOptionsColor = ref<string>('#000');
const dotsOptionsGradientColor = ref<[string, string]>(['#000', '#007fff']);
const dotsOptionsGradientType = ref<GradientType>('linear');
const dotsOptionsGradientRotation = ref(0);

// 码眼边框配置 ------------------------------------------------------------
const cornerSquareTypeOptions: { label: string; value: CornerSquareType }[] = [
  { label: '方形', value: 'square' },
  { label: '圆形', value: 'dot' },
  { label: '圆角', value: 'extra-rounded' }
];
const cornersSquareOptionsType = ref<CornerSquareType>('square');
const cornersSquareOptionsColor = ref<string>('#000');
const cornersSquareOptionsGradientColor = ref<[string, string]>(['#000', '#007fff']);
const cornersSquareOptionsGradientType = ref<GradientType>('linear');
const cornersSquareOptionsGradientRotation = ref(0);

// 码眼点配置 ------------------------------------------------------------
const cornerDotTypeOptions: { label: string; value: CornerDotType }[] = [
  { label: '方形', value: 'square' },
  { label: '圆形', value: 'dot' }
];
const cornersDotOptionsType = ref<CornerDotType>('square');
const cornersDotOptionsColor = ref<string>('#000');
const cornersDotOptionsGradientColor = ref<[string, string]>(['#000', '#007fff']);
const cornersDotOptionsGradientType = ref<GradientType>('linear');
const cornersDotOptionsGradientRotation = ref(0);

// 下载二维码
const qrCodeRef = ref<InstanceType<typeof QRCode> | null>(null);
const extension = ref<'PNG' | 'SVG' | 'JPEG' | 'WEBP'>('PNG');
const downloadQRCode = async () => {
  await qrCodeRef.value?.downloadQRCode(extension.value);
};
</script>

<style lang="scss" scoped></style>
