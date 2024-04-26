<template>
  <el-dialog
    :model-value="visible"
    :title="title"
    width="80%"
    class="max-w-screen-sm"
    center
    align-center
    :show-close="!isForce"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <section class="text-center">
      <div class="mb-4">{{ content }}</div>
      <el-progress
        :percentage="progress"
        :stroke-width="8"
        :striped="state === UPDATER_STATE.DOWNLOADING && progress < 100"
        :striped-flow="state === UPDATER_STATE.DOWNLOADING && progress < 100"
      />
    </section>

    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="!isForce" @click="handleCancel">取消</el-button>
        <el-button type="primary" :loading="isLoading" :disabled="isLoading" @click="handleConfirm">
          {{
            [UPDATER_STATE.CHECKED_FINISHED, UPDATER_STATE.DOWNLOADING].includes(props.state) &&
            hasNewVersion
              ? '立即下载'
              : '立刻安装'
          }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { UPDATER_STATE } from '@renderer/modules/updater/types';

interface Props {
  visible: boolean;
  title: string;
  content: string;
  state: UPDATER_STATE;
  hasNewVersion: boolean;
  progress: number;
  /** 是否强制更新 */
  isForce?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '',
  content: '',
  state: UPDATER_STATE.NORMAL,
  hasNewVersion: false,
  progress: 0
});

const emit = defineEmits<{
  cancel: [];
  confirm: [];
}>();

const isLoading = computed(() => [UPDATER_STATE.DOWNLOADING].includes(props.state));

const handleCancel = () => {
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<style lang="scss" scoped></style>
