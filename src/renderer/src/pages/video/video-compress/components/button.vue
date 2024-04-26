<template>
  <section class="flex justify-center">
    <el-button v-if="!isPause" type="primary" size="small" @click="pause">暂停转码</el-button>
    <el-button v-if="isPause" type="primary" size="small" @click="continueRun">继续转码</el-button>
    <el-button type="danger" size="small" :disabled="isRunning" @click="removeAllFiles">
      删除全部
    </el-button>
    <el-button type="warning" size="small" :disabled="isRunning" @click="reset">
      重置全部
    </el-button>
  </section>
</template>

<script lang="ts" setup>
import { useCompress, useVideo } from '@renderer/modules/video/composables';

const { removeAllFiles, resetAllFiles } = useVideo();
const { isRunning, isPause, pause, continueRun, resetCompress } = useCompress();

const reset = () => {
  resetAllFiles();
  resetCompress();
};
</script>

<style lang="scss" scoped></style>
