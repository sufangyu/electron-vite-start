<template>
  <section ref="uploadRef" class="upload-image">
    <el-upload
      :class="{
        'hide-uploader': attrs.limit !== undefined ? fileList.length >= attrs.limit : false
      }"
      v-bind="attrs"
      :file-list="fileList"
      action="#"
      list-type="picture-card"
      :http-request="handleAddFileToUploadQueue"
      :on-success="handleSuccess"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
    >
      <!-- 上传触发句柄 -->
      <template #default>
        <div class="text-center">
          <el-icon :size="32"><Plus :stroke-width="2" /></el-icon>
          <p class="block text-xs">{{ attrs.drag ? '拖拽或点击上传' : '点击上传' }}</p>
        </div>
      </template>

      <template #file="{ file }: { file: UploadFile }">
        <div class="upload-image__item">
          <el-image style="width: 100%; height: 100%" :src="file.url" fit="cover" />

          <div v-if="file.status !== FileStatus.上传成功" class="upload-image__item--status">
            <span>{{ getEnumKeyByEnumValue(FileStatus, file.status) }}</span>
            <!-- <span>{{ file.percentage }}</span> -->
          </div>

          <div v-if="file.status === FileStatus.上传成功" class="upload-image__item--acitons">
            <slot name="actions" :file="file" />

            <el-tooltip content="查看" placement="top">
              <span class="aciton-item" @click="handlePreview(file)">
                <ZoomIn :stroke-width="2" />
              </span>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <span class="aciton-item" @click="handleRemoveFile(file)">
                <Delete :stroke-width="2" />
              </span>
            </el-tooltip>
          </div>
        </div>
      </template>
    </el-upload>

    <!-- 图片预览弹窗 -->
    <el-image-viewer
      v-if="previewViewer.show"
      teleported
      :initial-index="previewViewer.index"
      :url-list="props.modelValue"
      @close="previewViewer.show = false"
    />
  </section>
</template>

<script lang="ts" setup>
import { Plus, ZoomIn, Delete } from '@icon-park/vue-next';
import {
  ElMessage,
  ElUpload,
  type UploadProps,
  type UploadFile,
  type UploadFiles,
  type UploadRawFile
} from 'element-plus';
import Sortable from 'sortablejs';

import { getEnumKeyByEnumValue } from '@core/utils';
import { FileStatus, useUploadHandler } from '@modules/common/upload';

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

const { fileList, handleAddFileToUploadQueue, setFileList } = useUploadHandler({
  multipart: props.multipart,
  chunkSizeLimit: props.chunkSizeLimit
});

watch(
  () => props.modelValue,
  (newVal = []) => setFileList(newVal),
  { immediate: true }
);

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

/**
 * 文件上传成功回调函数
 * @param _res
 * @param _uploadFile
 * @param uploadFiles
 */
const handleSuccess = (_res, _uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  _updateFileList(uploadFiles);
};

/**
 * 删除回调函数（组件钩子函数）
 * @param _uploadFile
 * @param uploadFiles
 */
const handleRemove = (_uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  _updateFileList(uploadFiles);
};

/**
 * 删除文件（自定义）
 * @param file
 */
const handleRemoveFile = (file: UploadFile) => {
  const newFileList = fileList.value.filter((it) => it.uid !== file.uid);
  handleRemove(file, newFileList);
};

/**
 * 当超出限制时执行的钩子函数
 * @param files
 * @param uploadFiles
 */
const handleExceed = (files: File[]) => {
  const message = `最多上传 ${attrs.limit} 个文件，本次选择了 ${files.length} 个文件`;
  ElMessage.warning({ message, grouping: true });
};

/**
 * 上传前钩子函数
 * - 校验文件格式
 * - 校验文件大小
 * @param rawFile
 */
const handleBeforeUpload = (rawFile: UploadRawFile) => {
  const { size } = rawFile;

  if (!props.multipart && size > props.maxSize * 1024 * 1024) {
    ElMessage.error({ message: `上传文件不能超过 ${props.maxSize} M`, grouping: true });
    return false;
  }

  return true;
};

// 图片预览 ----------------------------------------------------------------
const previewViewer = ref({
  show: false,
  index: 0
});
const handlePreview = (file: UploadFile) => {
  const index = props.modelValue.findIndex((it) => it === file.url);
  previewViewer.value.index = index;
  previewViewer.value.show = true;
};

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

<style lang="scss" scoped>
.upload-image {
  // fix: 拖拽框与上传框边框重复并且大小不一致
  :deep(.el-upload--picture-card.is-drag) {
    border: none;

    .el-upload-dragger {
      height: 100%;
    }
  }

  .hide-uploader {
    :deep(.el-upload--picture-card) {
      display: none;
    }
  }

  &__item {
    @apply relative w-full h-full;

    &:hover {
      .upload-image__item--acitons {
        @apply opacity-100;
      }
    }

    &--status {
      @apply absolute w-full h-full top-0 left-0 
        flex items-center justify-center
        bg-black bg-opacity-70 transition-all;

      > span {
        @apply mx-1 text-white text-xs;
      }
    }

    &--acitons {
      @apply absolute w-full h-full top-0 left-0 
        flex items-center justify-center
        bg-black bg-opacity-70 transition-all
        opacity-0;

      .aciton-item {
        @apply cursor-pointer mx-1.5 text-white text-lg;
      }
    }
  }
}
</style>
