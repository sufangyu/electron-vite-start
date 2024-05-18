<template>
  <el-select :placeholder="selectPlaceholder">
    <el-option v-for="(item, idx) in options" :key="idx" :value="item">
      <div class="flex items-center justify-between">
        <span>{{ item }}</span>
        <div v-if="idx > 1" class="icon-del" @click="removeOption(props.type, idx)">
          <close-one theme="outline" size="14" :stroke-width="3" />
        </div>
      </div>
    </el-option>
  </el-select>

  <div class="flex items-center mt-2 gap-1">
    <el-input v-model="newValue" :placeholder="addPlaceholder" />
    <el-button :type="buttonType" @click="addOption(props.type)">增加</el-button>
  </div>
</template>

<script lang="ts" setup>
import { CloseOne } from '@icon-park/vue-next';

import type { OptionType } from '@modules/video';
import { useVideoConfigStore } from '@store/index';

import { useSizeFps } from '../composables';

interface Props {
  /** 类型。size: fps: 帧数 */
  type: OptionType;
  /** 选择项目提示信息 */
  selectPlaceholder?: string;
  /** 增加输入框提示信息 */
  addPlaceholder?: string;
  /** 按钮类型 */
  buttonType?: 'primary' | 'success' | 'danger' | 'warning' | 'default';
}

const props = withDefaults(defineProps<Props>(), {
  // type: '',
  selectPlaceholder: '请选择',
  addPlaceholder: '请输入',
  buttonType: 'default'
});

const { config } = useVideoConfigStore();
const { newValue, addOption, removeOption } = useSizeFps();

const options = computed(() => {
  const result: (string | number)[] = [];
  switch (props.type) {
    case 'size':
      result.push(...config.sizeOptions);
      break;
    case 'fps':
      result.push(...config.fpsOptions);
      break;
    default:
  }
  return result;
});
</script>

<style lang="scss" scoped>
.icon-del {
  @apply text-slate-500 opacity-60 cursor-pointer
    hover:text-yellow-500 hover:opacity-90 hover:scale-125 duration-300;
}
</style>
