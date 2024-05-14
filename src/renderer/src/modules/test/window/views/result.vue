<template>
  <section class="p-4">
    <div class="text-center">
      <p>name: {{ route.name }}</p>
      <p>path: {{ route.path }}</p>
      <p>params: {{ route.params }}</p>
      <p>query: {{ route.query }}</p>
      <div class="my-4">
        <el-button :plain="true" @click="openMessag">Show message</el-button>
        <el-button :plain="true" @click="dialogVisible = true">Show dialog</el-button>
      </div>

      <div class="my-4">
        <el-button class="w-full" @click="closeWindow">关闭窗口</el-button>
      </div>
    </div>

    <div class="h-[800px] bg-gray-200 dark:bg-gray-900 rounded-lg py-8 text-center">
      这是占位内容块
    </div>
  </section>

  <el-dialog v-model="dialogVisible" title="Tips" width="80vw">
    <span>This is a message</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
import { useWindow } from '@core/hooks';

const route = useRoute();
const { closeWindow } = useWindow();

const dialogVisible = ref(false);
const openMessag = () => {
  ElMessage.success({ message: 'This is a message.', grouping: true });
};
</script>

<style lang="scss" scoped>
.drag {
  @apply pl-20 text-sm h-[40px] leading-[40px]
  bg-[#ededed] dark:bg-[#050505];
}
</style>
