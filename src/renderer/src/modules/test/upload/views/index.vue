<template>
  <AppMain title="文件上传">
    <section class="p-3">
      <Card title="图片批量上传">
        <p class="text-xs opacity-60 mb-2">根据文件大小, 自动调度上传方法</p>
        <UploadExtend v-model="files" accept="image/*" multiple :limit="5" multipart drag-sort drag>
          <template #actions="{ file }">
            <el-tooltip content="识别图片" placement="top">
              <span class="aciton-item" @click.prevent="handleOCR(file)">
                <TextRecognition :stroke-width="2" />
              </span>
            </el-tooltip>
          </template>
        </UploadExtend>

        <div class="mt-4 text-sm">
          <ul v-if="files.length > 0">
            <li v-for="(url, idx) in files" :key="idx" class="bg-gray-500 px-2 py-1 my-2 rounded">
              文件: {{ url }}
            </li>
          </ul>
          <span v-else class="text-center">暂无数据</span>
        </div>

        <div class="mt-4">
          <el-button type="danger" @click="handleSubmit">提交</el-button>
        </div>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { TextRecognition } from '@icon-park/vue-next';
import { UploadFile } from 'element-plus';

const files = ref<string[]>([
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
  'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
]);

const handleOCR = (file: UploadFile) => {
  console.log('识别图片', file.url);
};

const handleSubmit = () => {
  console.log(files.value);
};
</script>

<style scoped lang="scss">
.aciton-item {
  @apply cursor-pointer mx-1.5 text-white text-lg;
}
</style>
