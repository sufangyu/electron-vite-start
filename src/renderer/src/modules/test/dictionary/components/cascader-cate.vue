<template>
  <section>
    <el-cascader
      v-bind="{ ...attrs }"
      v-model="currentValue"
      :options="dictionaryTree(DICT_CODE_ENUM.互联网)"
      @change="handleCascaderChange"
    />
  </section>
</template>

<script lang="ts" setup>
import { ElCalendar, type CascaderValue } from 'element-plus';

import { useDictionary } from '@renderer/core/hooks';

import { getDictList } from '../api';
import { DICT_CODE_ENUM } from '../enums';

interface Props {
  modelValue: CascaderValue;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
});
const emits = defineEmits<{
  'update:modelValue': [value: CascaderValue];
}>();
const attrs = useAttrs() as typeof ElCalendar;

// 初始化、更新数据
const currentValue = ref<CascaderValue>(attrs.multiple ? [] : '');
watch(
  () => props.modelValue,
  (val) => {
    console.log('watch modelValue:', val);
    currentValue.value = val;
  }
);

// 更新 modelValue
const handleCascaderChange = (val: CascaderValue) => {
  emits('update:modelValue', val);
};

// 获取字典数据
const { dictionaryTree } = useDictionary<DICT_CODE_ENUM>({
  dictOptions: [{ code: DICT_CODE_ENUM.互联网 }],
  apiFunc: getDictList
});
</script>

<style lang="scss" scoped></style>
