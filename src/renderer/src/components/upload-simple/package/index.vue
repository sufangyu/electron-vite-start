<template>
  <section ref="uploadRef" class="upload-file">
    <el-upload
      :class="{
        'hide-uploader': attrs.limit !== undefined ? fileList.length >= attrs.limit : false
      }"
      v-bind="attrs"
      :file-list="fileList"
      action="#"
      :http-request="handleAddFileToUploadQueue"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
    >
      <template #default>
        <slot>
          <el-button type="primary">点击上传</el-button>
        </slot>
      </template>

      <!-- 遍历父组件传入的 slot, 透传给子组件 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps" :key="name">
        <slot :name="name" v-bind="slotProps"></slot>
      </template>
    </el-upload>
  </section>
</template>

<script lang="ts" setup>
import { ElUpload, type UploadProps, type UploadFiles } from 'element-plus';
import Sortable from 'sortablejs';

import { FileStatus, useUploadHandler, useUploadLifeCycle } from '@modules/common/upload';

import { Props } from './types';

const props = withDefaults(defineProps<Props>(), {
  dragSort: false,
  maxSize: 5,
  multipart: true,
  chunkSizeLimit: 5,
  modelValue: () => []
});

const attrs = useAttrs() as UploadProps;

const emits = defineEmits(['update:modelValue']);

// 上传处理
const { fileList, handleAddFileToUploadQueue, setFileList } = useUploadHandler({
  multipart: props.multipart,
  chunkSizeLimit: props.chunkSizeLimit
});

/**
 * 更新文件列表
 * @param uploadFiles 最新文件
 */
const _updateFileList = (uploadFiles: UploadFiles) => {
  const newFileList = uploadFiles
    .filter((file) => file.status === FileStatus.上传成功)
    .map((file) => {
      // 初始化已上传取 file.url, 本次上传: file.response?.path
      return (file.response as { path?: string })?.path ?? file.url;
    });

  emits('update:modelValue', newFileList ?? []);
};

// 上传生命周期
const { handleExceed, handleBeforeUpload, handleUploadSuccess, handleRemove } = useUploadLifeCycle({
  limit: attrs.limit,
  maxSize: props.maxSize,
  multipart: props.multipart,
  updateFilesCallback(_uploadFile, uploadFiles) {
    _updateFileList(uploadFiles);
  }
});

watch(
  () => props.modelValue,
  (newVal = []) => setFileList(newVal),
  { immediate: true }
);

// 拖拽排序 ----------------------------------------------------------------
const uploadRef = ref<HTMLElement | null>();
const initDragSort = () => {
  const $fileList = uploadRef.value?.querySelectorAll('.el-upload-list')?.[0] as
    | HTMLElement
    | undefined;
  if (!$fileList) {
    return;
  }

  Sortable.create($fileList, {
    filter: function (_ev, item) {
      if (item?.classList?.contains('is-success')) {
        return false;
      }
      return true;
    },
    onEnd: async ({ oldIndex, newIndex }) => {
      if (oldIndex === newIndex) {
        return;
      }

      let newFileList: string[] = Object.assign([], props.modelValue);
      const dragFileItem = newFileList[oldIndex!];
      newFileList.splice(oldIndex!, 1);
      newFileList.splice(newIndex!, 0, dragFileItem);
      newFileList = newFileList.filter(Boolean);

      emits('update:modelValue', newFileList);
    }
  });
};

onMounted(() => {
  props.dragSort && initDragSort();
});
</script>

<style lang="scss" scoped></style>
