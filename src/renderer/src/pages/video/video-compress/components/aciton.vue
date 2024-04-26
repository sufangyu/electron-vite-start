<template>
  <section class="flex justify-center gap-2">
    <div class="button">
      <el-upload
        ref="uploadRef"
        class="flex"
        action="#"
        accept="video/*"
        multiple
        drag
        :show-file-list="false"
        :http-request="addFile"
        :on-exceed="handleExceed"
      >
        <el-tooltip content="选择视频文件" placement="top">
          <Plus :stroke-width="3" />
        </el-tooltip>
      </el-upload>
    </div>
    <div class="button" @click="runCompress">
      <el-tooltip content="开始转换" placement="top">
        <UpdateRotation theme="outline" :class="{ 'is-running': isRunning }" :stroke-width="3" />
      </el-tooltip>
    </div>

    <div class="button" @click="$route.push({ name: VIDEO_ROUTER_NAME.VIDEO_CONFIG })">
      <el-tooltip content="压缩配置" placement="top">
        <SettingConfig :stroke-width="3" />
      </el-tooltip>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElUpload, UploadUserFile } from 'element-plus';
import { Plus, UpdateRotation, SettingConfig } from '@icon-park/vue-next';
import { useCompress, useVideo } from '@renderer/modules/video/composables';
import { VIDEO_ROUTER_NAME } from '@router/index';

const $route = useRouter();
const { addFile } = useVideo();
const { isRunning, run: runCompress, onProgressNotice } = useCompress();

onProgressNotice();

const uploadRef = ref<InstanceType<typeof ElUpload>>();
// 当超出限制时，执行的钩子函数
const handleExceed = (files: File[], uploadFiles: UploadUserFile[]) => {
  console.log(files, uploadFiles);
};
</script>

<style lang="scss" scoped>
.button {
  @apply w-20 h-20 rounded-lg cursor-pointer
    flex justify-center items-center text-4xl
  bg-white text-slate-600
  dark:bg-slate-800 dark:text-slate-300;
}

.is-running {
  @apply animate-spin text-slate-300 cursor-wait;
}

:deep(.el-upload-dragger) {
  padding: 0 !important;
  border: none !important;
}
</style>
