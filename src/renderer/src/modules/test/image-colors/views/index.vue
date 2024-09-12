<template>
  <AppMain title="图片取色">
    <section class="p-3">
      <Card title="网络图片">
        <div class="mb-4 flex flex-wrap gap-4">
          <div v-for="url in networkImages" :key="url" class="flex flex-col justify-center">
            <p><el-image class="w-36 h-36" :src="url" :preview-src-list="[url]" fit="cover" /></p>
            <el-button type="default" @click="handleGetColor(url)">取图片颜色</el-button>
          </div>
        </div>

        <div class="flex gap-8">
          <div>
            <h3 class="mb-2 text-sm text-gray-300">主色调</h3>
            <div class="flex flex-wrap gap-2">
              <p
                v-if="!resultNetwork.dominantColor"
                class="text-sm opacity-50 h-[56px] leading-[56px]"
              >
                暂无数据！
              </p>
              <span
                v-else
                class="block w-[56px] h-[56px] rounded-full"
                :style="{
                  backgroundColor: `rgba(${resultNetwork.dominantColor!.join(',')})`
                }"
              />
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm text-gray-300">调色版</h3>
            <div class="flex flex-wrap gap-2">
              <p
                v-if="(resultNetwork.palette ?? []).length === 0"
                class="text-sm opacity-50 h-[56px] leading-[56px]"
              >
                暂无数据！
              </p>
              <span
                v-for="(item, idx) in resultNetwork.palette ?? []"
                v-else
                :key="idx"
                class="block w-[56px] h-[56px] rounded-full"
                :style="{
                  backgroundColor: `rgba(${item.join(',')})`
                }"
              />
            </div>
          </div>
        </div>
      </Card>

      <Card title="本地图片">
        <div class="mb-4 flex gap-2 items-center">
          <p>
            <el-image
              class="w-36 h-36"
              :src="imgBase64"
              :preview-src-list="[imgBase64]"
              fit="cover"
            />
          </p>
          <el-upload
            action=""
            :auto-upload="false"
            accept="image/*"
            :show-file-list="false"
            :on-change="handleChange"
          >
            <el-button type="primary">选择图片</el-button>
          </el-upload>
        </div>

        <div class="flex gap-8">
          <div>
            <h3 class="mb-2 text-sm text-gray-300">主色调</h3>
            <div class="flex flex-wrap gap-2">
              <p
                v-if="!resultLocal.dominantColor"
                class="text-sm opacity-50 h-[56px] leading-[56px]"
              >
                暂无数据！
              </p>
              <span
                v-else
                class="block w-[56px] h-[56px] rounded-full"
                :style="{
                  backgroundColor: `rgba(${resultLocal.dominantColor!.join(',')})`
                }"
              />
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-sm text-gray-300">调色版</h3>
            <div class="flex flex-wrap gap-2">
              <p
                v-if="(resultLocal.palette ?? []).length === 0"
                class="text-sm opacity-50 h-[56px] leading-[56px]"
              >
                暂无数据！
              </p>
              <span
                v-for="(item, idx) in resultLocal.palette ?? []"
                v-else
                :key="idx"
                class="block w-[56px] h-[56px] rounded-full"
                :style="{
                  backgroundColor: `rgba(${item.join(',')})`
                }"
              />
            </div>
          </div>
        </div>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import ColorThief from 'colorthief';
import { ElLoading, ElMessage, UploadFile } from 'element-plus';

import { fileToBase64 } from '@core/utils';

type RGB = [number, number, number];
type ColorThiefResult = {
  dominantColor?: RGB;
  palette?: RGB[];
};

const getMainColors = async (url: string): Promise<ColorThiefResult> => {
  return new Promise((resolv, _reject) => {
    const loading = ElLoading.service({
      lock: true,
      text: '识别中'
    });
    const img = new Image(); // 创建 Image 对象
    img.crossOrigin = 'Anonymous';
    img.src = url;

    img.onload = async function () {
      try {
        const colorThief = new ColorThief();
        console.log('colorThief', colorThief);
        const dominantColor = (await colorThief.getColor(img)) as RGB;
        const palette = (await colorThief.getPalette(img)) as RGB[];
        const result: ColorThiefResult = { dominantColor, palette };
        resolv(result);
      } finally {
        loading.close();
      }
    };
    img.onerror = function () {
      ElMessage.error({ message: '图片加载失败', grouping: true });
      loading.close();
    };
  });
};

const networkImages = [
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
  'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
  'https://lokeshdhakar.com/projects/color-thief/image-2.4461c1c0.jpg'
];
const resultNetwork = ref<ColorThiefResult>({});
const handleGetColor = async (url: string) => {
  const result = await getMainColors(url);
  resultNetwork.value = result;
};

const imgBase64 = ref('');
const resultLocal = ref<ColorThiefResult>({});
const handleChange = async (file: UploadFile) => {
  const base64 = (await fileToBase64(file.raw)) ?? '';
  imgBase64.value = base64;
  const result = await getMainColors(base64);
  resultLocal.value = result;
};
</script>

<style lang="scss" scoped></style>
