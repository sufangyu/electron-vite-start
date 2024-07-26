<template>
  <div class="table-extend" v-bind="tableExtendAttr">
    <div v-if="toolbarVisible" class="table-extend__toolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left"></slot>
      </div>
      <div class="toolbar-right">
        <slot name="toolbar-right"></slot>
        <div class="flex items-center gap-2">
          <el-tooltip content="行密度" placement="top">
            <el-dropdown trigger="click" popper-class="line-size-popper">
              <el-button link :icon="RowHeight"></el-button>
              <template #dropdown>
                <el-dropdown-menu size="small">
                  <el-dropdown-item
                    v-for="item in [
                      { label: '默认', value: 'default' },
                      { label: '中等', value: 'medium' },
                      { label: '紧凑', value: 'small' }
                    ]"
                    :key="item.value"
                    :class="{ selected: lineSize == item.value }"
                    @click="handleLineSizeChange(item.value as LineSize)"
                  >
                    {{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
          <el-tooltip content="列设置" placement="top">
            <el-button ref="columnSettingRef" link :icon="SettingTwo" />
          </el-tooltip>
        </div>
      </div>
    </div>

    <div class="table-extend__wrapper">
      <el-table
        ref="tableRef"
        :class="{
          [`table-line-size--${lineSize}`]: true
        }"
        style="width: 100%"
        height="100%"
        v-bind="$attrs"
      >
        <slot></slot>
      </el-table>
    </div>

    <el-popover ref="popoverRef" :virtual-ref="columnSettingRef" trigger="click" virtual-triggering>
      <div class="flex items-center justify-between">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          class="filter-check-all"
          @change="handleCheckAllChange"
        >
          列展示
        </el-checkbox>
        <el-button link type="primary" @click="() => handleResetColumnsVisible(false)">
          重置
        </el-button>
      </div>
      <el-checkbox-group
        v-model="columnsVisiable"
        size="small"
        @change="handleColumnsVisibleChange"
      >
        <div v-for="item in columns" :key="item.label">
          <el-checkbox :label="item.label" :value="item.value" />
        </div>
      </el-checkbox-group>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { RowHeight, SettingTwo } from '@icon-park/vue-next';
import { ElButton, ElPopover, ElTable, type TableColumnCtx } from 'element-plus';

import { LineSize, Props } from './types';

defineOptions({
  name: 'TableExtend'
});

const props = withDefaults(defineProps<Props>(), {
  toolbarVisible: true
});
const emits = defineEmits(['update:columnsHidden']);

const $route = useRoute();
const curCacheKey = `table-extend-${props.cacheKey ?? window.btoa($route.path)}`;

const tableRef = ref<InstanceType<typeof ElTable> | null>(null);
const columnSettingRef = ref<InstanceType<typeof ElButton> | null>(null);
const popoverRef = ref<InstanceType<typeof ElPopover> | null>(null);

// 表格列显示隐藏、行密度控制 ---------------------------------------------------------------
const lineSize = ref<LineSize>('default');
const columns = ref<{ label: string; value: string }[]>([]);
const columnsVisiable = ref<string[]>([]);
// 全选勾选框
const checkAll = ref(true);
const isIndeterminate = ref(true);

// 全选变化
const handleCheckAllChange = (val) => {
  handleResetColumnsVisible(!val as boolean);
  isIndeterminate.value = false;
};

/**
 * 设置行密度
 * @param val 密度类型
 */
const handleLineSizeChange = (type: LineSize) => {
  lineSize.value = type;
  localStorage.setItem(
    curCacheKey,
    JSON.stringify({
      lineSize: lineSize.value,
      columns: columnsVisiable.value
    })
  );
};

/**
 * 列变化
 * @param val
 */
const handleColumnsVisibleChange = (val) => {
  const curColumnsVisiable = val as string[];
  localStorage.setItem(
    curCacheKey,
    JSON.stringify({
      lineSize: lineSize.value,
      columns: curColumnsVisiable
    })
  );

  // 全选
  const checkedCount = curColumnsVisiable.length;
  checkAll.value = checkedCount === columns.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < columns.value.length;

  // 隐藏列
  const columnsHidden: string[] = columns.value
    .filter((it) => !curColumnsVisiable.includes(it.value))
    .map((it) => it.value);

  emits('update:columnsHidden', columnsHidden);
};

/**
 * 重置显示的列
 * @param isEmpty 是否空
 */
const handleResetColumnsVisible = (isEmpty = false) => {
  columnsVisiable.value = isEmpty ? [] : columns.value.map((it) => it.value);
  handleColumnsVisibleChange(columnsVisiable.value);
};

/**
 * 获取表格设置
 * @param columns 显示的列集合
 */
const getTableSetting = (columns: string[]) => {
  const settingCache = localStorage.getItem(curCacheKey);
  const curSetting = settingCache ? JSON.parse(settingCache) : {};
  lineSize.value = curSetting.lineSize ?? 'default';
  columnsVisiable.value = curSetting.columns ?? columns;

  // 触发一次变化
  handleColumnsVisibleChange(columnsVisiable.value);
};

/**
 * 获取表格的列数据
 */
const getTableColumns = async () => {
  await nextTick();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableColumns = (tableRef.value?.columns ?? []) as TableColumnCtx<any>[];
  tableColumns.forEach((column) => {
    if (['selection'].includes(column.type) || !column.property) {
      return;
    }

    columns.value.push({
      label: column.label,
      value: column.property
    });
  });

  const curColumnsVisiable = columns.value.map((it) => it.value);
  getTableSetting(curColumnsVisiable);
};

onMounted(() => {
  getTableColumns();
});
</script>

<style lang="scss" scoped>
.table-extend {
  @apply h-full flex flex-col overflow-hidden;

  &__toolbar {
    @apply flex-1 flex-shrink-0 pb-2 flex items-center justify-between;
  }

  &__wrapper {
    @apply h-full overflow-hidden;
  }

  // 表格的行密度样式 ----------------------------------------------------------------------------
  :deep(.el-table.table-line-size--default) {
    .cell {
      padding: 0 12px;
    }

    .el-table__cell {
      padding: 8px 0;
    }
  }

  :deep(.el-table.table-line-size--medium) {
    .cell {
      padding: 0 10px;
    }
    .el-table__cell {
      padding: 6px 0;
    }
  }

  :deep(.el-table.table-line-size--small) {
    .cell {
      padding: 0 8px;
    }
    .el-table__cell {
      padding: 4px 0;
    }
  }
}

// 全选勾选下文本样式
.filter-check-all {
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: inherit;
  }
}
</style>

<style lang="scss">
// 表格的行密度勾选高亮 .line-size-popper
.el-popper.line-size-popper {
  .el-dropdown-menu__item.selected {
    color: var(--el-color-primary);
  }
}
</style>
