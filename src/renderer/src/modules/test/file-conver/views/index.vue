<template>
  <AppMain title="文件格式转换">
    <div class="p-3">
      <Card title="图片转 base64">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-xs mb-1">原图</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="imgSrc" alt="" />
            </div>
          </div>
          <el-button size="small" type="primary" @click="handleImageToBase64">转换</el-button>
          <div>
            <p class="text-xs">base64 结果</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="imgBase64" alt="" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="base64 转 Blob">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-xs mb-1">base64</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="imgBase64" alt="" />
            </div>
          </div>
          <el-button size="small" type="primary" @click="handleBase64ToBlob">转换</el-button>
          <div>
            <p class="text-xs mb-1">Blob 结果</p>
            <div class="w-[250px] h-[166px]">
              <p>{{ imgBlob }}</p>
              <img width="100%" height="100%" :src="imgBlobUrl" alt="" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="base64 转 ArrayBuffer">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-xs mb-1">base64</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="imgBase64" alt="" />
            </div>
          </div>
          <el-button size="small" type="primary" @click="handleBase64ToArrayBuffer">转换</el-button>
          <div>
            <p class="text-xs mb-1">ArrayBuffer 结果</p>
            <div class="w-[250px] h-[166px]">
              {{ imgArrayBuffer }}
            </div>
          </div>
        </div>
      </Card>

      <Card title="base64 转 File">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-xs mb-1">base64</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="imgBase64" alt="" />
            </div>
          </div>
          <el-button size="small" type="primary" @click="handleBase64ToFile">转换</el-button>
          <div>
            <p class="text-xs mb-1">File 结果</p>
            <div class="w-[250px] h-[166px]">
              {{ imgFile }}
            </div>
          </div>
        </div>
      </Card>

      <Card title="File 转 base64">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-xs mb-1">file</p>
            <div class="w-[250px] h-[166px]">
              {{ imgFile }}
            </div>
          </div>
          <el-button size="small" type="primary" @click="handleFileToBase64">转换</el-button>
          <div>
            <p class="text-xs mb-1">File 结果</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="fileBase64" alt="" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="blob 转 Base64">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-xs mb-1">flob</p>
            <div class="w-[250px] h-[166px]">
              {{ imgBlob }}
            </div>
          </div>
          <el-button size="small" type="primary" @click="handleBolbToBase64">转换</el-button>
          <div>
            <p class="text-xs mb-1">Base64 结果</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="blobBase64" alt="" />
            </div>
          </div>
        </div>
      </Card>

      <Card title="arrayBuffer 转 Base64">
        <div class="flex items-center gap-4">
          <div>
            <p class="text-xs mb-1">arrayBuffer</p>
            <div class="w-[250px] h-[166px]">
              {{ imgArrayBuffer }}
            </div>
          </div>
          <el-button size="small" type="primary" @click="handleArrayBufferToBase64">转换</el-button>
          <div>
            <p class="text-xs mb-1">Base64 结果</p>
            <div class="w-[250px] h-[166px]">
              <img width="100%" height="100%" :src="arrayBufferBase64" alt="" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  </AppMain>
</template>

<script lang="ts" setup>
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  base64ToBlob,
  base64ToFile,
  blobToBase64,
  fileToBase64,
  imageToBase64
} from '@core/utils';

const imgSrc = 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg';
const imgBase64 = ref('');
const imgBlob = ref<Blob | null>(null);
const imgBlobUrl = ref('');
const imgArrayBuffer = ref<ArrayBuffer | null>(null);
const imgFile = ref<File | null>(null);
const fileBase64 = ref<string>('');
const blobBase64 = ref<string>('');
const arrayBufferBase64 = ref<string>('');

const handleImageToBase64 = async () => {
  imgBase64.value = await imageToBase64(imgSrc);
};

const handleBase64ToBlob = async () => {
  const result = await base64ToBlob(imgBase64.value);
  imgBlob.value = result;
  imgBlobUrl.value = window.URL.createObjectURL(result);
};

const handleBase64ToArrayBuffer = async () => {
  const result = base64ToArrayBuffer(imgBase64.value);
  console.log('result', result);
  imgArrayBuffer.value = result;
};

const handleBase64ToFile = async () => {
  const result = await base64ToFile(imgBase64.value);
  console.log('result', result);
  imgFile.value = result;
};

const handleFileToBase64 = async () => {
  const result = (await fileToBase64(imgFile.value!)) ?? '';
  fileBase64.value = result;
};

const handleBolbToBase64 = async () => {
  const result = (await blobToBase64(imgBlob.value!)) ?? '';
  blobBase64.value = result;
};

const handleArrayBufferToBase64 = () => {
  const result = arrayBufferToBase64(imgArrayBuffer.value!);
  arrayBufferBase64.value = result;
};
</script>

<style lang="scss" scoped></style>
