<template>
  <component
    :is="virtual ? 'el-select-v2' : 'el-select'"
    ref="selectRef"
    class="select-extend"
    :style="{ width: width || '100%' }"
    v-bind="{
      ...attrs
    }"
    :options="!virtual ? null : attrs.options"
    @change="handlesSelectChange"
  >
    <!-- 有 header slot 或 多选且显示全选勾选项显示 -->
    <template v-if="slots.header || (checkAllVisiable && attrs.multiple !== false)" #header>
      <div>
        <el-checkbox
          v-if="checkAllVisiable && attrs.multiple !== false"
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAll"
        >
          全选
        </el-checkbox>
      </div>
      <slot name="header" v-bind="{}"></slot>
    </template>

    <!-- 透传插槽（过滤 header、footer） -->
    <template v-for="(_index, name) in slotsFilter" #[name]="data" :key="name">
      <slot :name="name" v-bind="data" />
    </template>

    <template #footer>
      <!-- 非虚拟列表且有分页时, 显示分页组件，用于分批加载选项 -->
      <div v-if="!virtual && pagination" class="flex justify-center">
        <el-pagination
          v-model:current-page="paginationOption.pageNum"
          v-model:page-size="paginationOption.pageSize"
          :layout="paginationOption.layout ?? 'total, prev, pager, next, jumper'"
          :pager-count="paginationOption.pagerCount ?? 5"
          :total="paginationOption.total"
          v-bind="{
            size: 'small',
            background: true,
            ...paginationOption
          }"
          @change="handlePaginationChange"
        />
      </div>
      <slot name="footer" v-bind="{}"></slot>
    </template>
  </component>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types */
import { ElSelect } from 'element-plus';
import { cloneDeep } from 'lodash-es';

import { Props } from './types';
import { extractOptions, extractOptionsBySlot } from './utils';

const props = withDefaults(defineProps<Props>(), {
  virtual: false,
  pagination: false,
  checkAllVisiable: false,
  paginationOption: () => ({
    pageNum: 1,
    pageSize: 5
  })
});

const emits = defineEmits<{
  'update:modelValue': [value: any];
  change: [value: any];
  'pagination-change': [pageNum: number, pageSize: number];
}>();

const attrs = useAttrs();
const slots = useSlots();
const selectRef = ref<InstanceType<typeof ElSelect> | null>(null);

// 过滤指定 slot 后的插槽
const slotsFilter = computed((): Record<string, Function> => {
  return Object.keys(slots).reduce((filtered, name) => {
    if (!['header', 'footer'].includes(name)) {
      filtered[name] = slots[name];
    }
    return filtered;
  }, {});
});

// 选择选项数据源
const optionSources = computed(
  (): {
    label?: string | number;
    value?: string | number | boolean | object;
    disabled?: boolean;
  }[] => {
    const result: any[] = [];
    if (props.virtual) {
      // 虚拟列表
      result.push(...extractOptions(attrs.options as any[]));
    } else {
      // 常规列表
      result.push(...extractOptionsBySlot(slotsFilter.value));
    }
    return result;
  }
);

// 全选
const isIndeterminate = ref(false);
const checkAll = computed({
  get() {
    const _deval = (attrs.modelValue as []) ?? [];
    const list = optionSources.value.filter((it) => !it.disabled);
    // 半选状态
    isIndeterminate.value = _deval?.length === 0 ? false : _deval?.length !== list.length;

    return _deval?.length === list.length;
  },
  set(val) {
    return val;
  }
});
const handleCheckAll = (val) => {
  let selectedAllValue: any[] = [];
  if (val) {
    selectedAllValue = optionSources.value.filter((it) => !it.disabled).map((it) => it.value);
  }

  emits('update:modelValue', selectedAllValue);
  emits('change', selectedAllValue);
};

/**
 * 选择值改变触发
 * @param val
 */
const handlesSelectChange = (val) => {
  const selectedAllValue = cloneDeep(val);
  emits('update:modelValue', selectedAllValue);
  emits('change', selectedAllValue);
};

/**
 * 分页值变更触发
 * @param currentPage 当前页码
 * @param pageSize 页面数量
 */
const handlePaginationChange = (currentPage: number, pageSize: number) => {
  emits('pagination-change', currentPage, pageSize);
};
</script>

<style lang="scss" scoped></style>
