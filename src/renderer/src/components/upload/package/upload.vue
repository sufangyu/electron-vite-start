<template>
  <section
    ref="uploadRef"
    class="upload-image"
    :class="{ 'is-disabled': attrs.disabled !== false }"
  >
    <el-upload
      ref="uploadRawRef"
      :class="{
        'hide-uploader': attrs.limit !== undefined ? fileList.length >= attrs.limit : false,
        [`upload-size__${size}`]: true
      }"
      v-bind="attrs"
      :file-list="fileList"
      action="#"
      list-type="picture-card"
      :http-request="handleAddFileToUploadQueue"
      :on-success="handleUploadSuccess"
      :on-remove="handleRemove"
      :on-exceed="handleExceed"
      :before-upload="handleBeforeUpload"
    >
      <!-- 上传触发句柄 -->
      <template #trigger>
        <div class="text-center">
          <el-icon :size="32"><Plus :stroke-width="2" /></el-icon>
          <p class="block text-xs">{{ isDrag ? '拖拽或点击上传' : '点击上传' }}</p>
        </div>
      </template>

      <template #default>
        <div
          v-if="paste && (attrs.limit === undefined ? false : fileList.length < attrs.limit)"
          class="paste-trigger"
        >
          <textarea
            ref="pasteTiggerRef"
            v-model="pasteInputValue"
            :disabled="attrs.disabled"
            placeholder="粘贴上传"
            @input="handlePasteInput"
            @paste.stop="handlePasteUpload"
          />
        </div>
      </template>

      <!-- 文件/图片列表 -->
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

      <!-- 遍历父组件传入的 slot, 透传给子组件 -->
      <template v-for="(_, name) in $slots" #[name]="slotProps" :key="name">
        <slot :name="name" v-bind="slotProps"></slot>
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
import { ElUpload, type UploadProps, type UploadFile, type UploadFiles } from 'element-plus';
import Sortable from 'sortablejs';

import { getEnumKeyByEnumValue } from '@core/utils';
import { FileStatus, useUploadHandler, useUploadLifeCycle } from '@modules/common/upload';

import { Props } from './types';

const props = withDefaults(defineProps<Props>(), {
  paste: false,
  dragSort: false,
  maxSize: 5,
  multipart: true,
  chunkSizeLimit: 5,
  modelValue: () => [],
  size: 'default'
});

const attrs = useAttrs() as UploadProps;

const emits = defineEmits(['update:modelValue']);

// 是否支持推拽上传
const isDrag = computed(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return attrs.drag === '' || !!attrs.drag;
});

const {
  uploadRawRef,
  fileList,
  handleAddFileToUploadQueue,
  setFileList,
  pasteTiggerRef,
  pasteInputValue,
  handlePasteInput,
  handlePasteUpload
} = useUploadHandler({
  multipart: props.multipart,
  maxSize: props.maxSize,
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

// 上传生命周期
const { handleExceed, handleBeforeUpload, handleUploadSuccess, handleRemove } = useUploadLifeCycle({
  accept: attrs.accept,
  limit: attrs.limit,
  maxSize: props.maxSize,
  multipart: props.multipart,
  updateFilesCallback(_uploadFile, uploadFiles) {
    _updateFileList(uploadFiles);
  }
});

/**
 * 删除文件（自定义）
 * @param file
 */
const handleRemoveFile = (file: UploadFile) => {
  const newFileList = fileList.value.filter((it) => it.uid !== file.uid);
  handleRemove(file, newFileList);
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
  overflow: hidden;

  &.is-disabled {
    :deep(.el-upload-dragger),
    .paste-trigger textarea {
      @apply cursor-not-allowed opacity-60;
    }
  }

  > div {
    overflow: hidden;
  }

  :deep(.el-upload-list--picture-card) {
    // float: left;
    display: block;
    flex-wrap: inherit;

    .el-upload-list__item {
      float: left;
    }
  }

  :deep(.el-upload--picture-card) {
    float: left;
    margin-bottom: 8px;
    margin-right: 8px;
  }

  // fix: 拖拽框与上传框边框重复并且大小不一致
  :deep(.el-upload--picture-card.is-drag) {
    border: none;

    .el-upload-dragger {
      height: 100%;
    }
  }

  :deep(.el-upload__tip) {
    clear: both;
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

  // 粘贴上传触发区域
  .paste-trigger {
    background-color: var(--el-fill-color-blank);
    margin: 0 0 8px 0;
    @apply box-border inline-flex h-[148px] w-[148px] leading-[146px] overflow-hidden p-0 align-top;

    float: left;

    textarea {
      @apply block h-full w-full leading-[inherit] text-xs text-center outline-none resize-none bg-transparent;
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;

      &:focus {
        border: 1px dashed var(--el-color-primary);
      }
    }
  }

  // 尺寸
  .upload-size__small {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      @apply w-[110px] h-[110px];
    }

    :deep(.el-upload--picture-card.is-drag) {
      .el-upload-dragger {
        @apply p-0 pt-5;
      }
    }

    .paste-trigger {
      @apply w-[110px] h-[110px] leading-[100px];
    }
  }

  .upload-size__mini {
    :deep(.el-upload--picture-card),
    :deep(.el-upload-list--picture-card .el-upload-list__item) {
      @apply w-[90px] h-[90px];
    }

    :deep(.el-upload--picture-card.is-drag) {
      .el-upload-dragger {
        @apply p-0 pt-3;
      }
    }

    .paste-trigger {
      @apply w-[90px] h-[90px] leading-[90px];
    }
  }
}
</style>
