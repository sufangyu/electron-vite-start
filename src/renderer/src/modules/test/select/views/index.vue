<template>
  <AppMain title="选择器">
    <div class="p-3">
      <Card title="基础用法">
        <SelectExtend v-model="singleVal" width="50%" placeholder="请选择">
          <el-option
            v-for="(item, idx) in optionData"
            :key="item + '-' + idx"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ singleVal }}</p>
      </Card>

      <Card title="多选（禁用选项、可清空）">
        <SelectExtend
          v-model="multipleVal"
          placeholder="请选择"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
        >
          <el-option
            v-for="(item, idx) in optionData"
            :key="item + '-' + idx"
            :label="item.label"
            :value="item"
            :disabled="item.disabled"
            value-key="value"
          />
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ multipleVal }}</p>
      </Card>

      <Card title="自定义模板">
        <SelectExtend
          v-model="labelTemplVal"
          width="50%"
          placeholder="请选择"
          multiple
          clearable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
        >
          <el-option
            v-for="(item, idx) in optionData"
            :key="item + '-' + idx"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          >
            <span style="float: left">{{ item.label }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
                margin-right: 8px;
              "
            >
              value: {{ item.value }}
            </span>
          </el-option>
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ labelTemplVal }}</p>
      </Card>

      <Card title="支持快捷全选">
        <SelectExtend
          v-model="checkAllVal"
          width="50%"
          placeholder="请选择"
          multiple
          clearable
          check-all-visiable
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          @change="handleSelectChange"
        >
          <el-option
            v-for="(item, idx) in optionData"
            :key="item + '-' + idx"
            :label="item.label"
            :value="item"
            :disabled="item.disabled"
            value-key="value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
                margin-right: 8px;
              "
            >
              value: {{ item.value }}
            </span>
          </el-option>
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ checkAllVal }}</p>
      </Card>

      <Card title="自定义下拉菜单头部、底部">
        <SelectExtend
          v-model="checkAllVal"
          width="50%"
          placeholder="请选择"
          multiple
          clearable
          :check-all-visiable="false"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
        >
          <template #header> 自定义头部内容 </template>
          <template #footer> 自定义底部内容 </template>

          <el-option
            v-for="(item, idx) in optionData"
            :key="item + '-' + idx"
            :label="item.label"
            :value="item"
            :disabled="item.disabled"
            value-key="value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
                margin-right: 8px;
              "
            >
              value: {{ item.value }}
            </span>
          </el-option>
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ checkAllVal }}</p>
      </Card>

      <Card title="分页">
        <SelectExtend
          v-model="cities"
          width="80%"
          placeholder="请选择"
          clearable
          multiple
          :loading="loading"
          :pagination="true"
          :pagination-option="paginationOption"
          @pagination-change="handkeCurrentChange"
        >
          <el-option
            v-for="(item, idx) in cityList"
            :key="item + '-' + idx"
            :label="item.label"
            :value="item"
            value-key="value"
          >
            <span style="float: left">{{ item.label }} - {{ idx + 1 }}</span>
            <span
              style="
                float: right;
                color: var(--el-text-color-secondary);
                font-size: 13px;
                margin-right: 8px;
              "
            >
              value: {{ item.value }}
            </span>
          </el-option>
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ cities }}</p>
        <p class="text-sm mt-2">分页信息: {{ paginationOption }}</p>
      </Card>

      <Card title="将选项进行分组">
        <SelectExtend
          v-model="groupVal"
          width="50%"
          placeholder="请选择"
          multiple
          clearable
          :check-all-visiable="true"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          @change="handleSelectChange"
        >
          <el-option-group v-for="group in optionsGroup" :key="group.label" :label="group.label">
            <el-option
              v-for="item in group.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-option-group>
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ groupVal }}</p>
      </Card>

      <Card title="单选-虚拟化">
        <SelectExtend
          v-model="singleVirtualVal"
          width="50%"
          placeholder="请选择"
          virtual
          :options="optionDataVirtual"
        >
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ singleVirtualVal }}</p>
      </Card>

      <Card title="多选-虚拟化">
        <SelectExtend
          v-model="multipleVirtualVal"
          width="50%"
          placeholder="请选择"
          virtual
          :options="optionDataVirtual"
          multiple
          clearable
          filterable
          :check-all-visiable="true"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
        >
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ multipleVirtualVal }}</p>
      </Card>

      <Card title="分组-虚拟化">
        <SelectExtend
          v-model="groupValVal"
          width="50%"
          placeholder="请选择"
          virtual
          :options="optionGroupVirtual"
          multiple
          clearable
          filterable
          :check-all-visiable="true"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
        >
          <template #default="{ item }">
            <span style="margin-right: 8px; float: left">{{ item.label }}</span>
            <span
              style="
                color: var(--el-text-color-secondary);
                font-size: 13px;
                float: right;
                margin-right: 8px;
              "
            >
              {{ item.value }}
            </span>
          </template>
        </SelectExtend>
        <p class="text-sm mt-2">选择结果: {{ groupValVal }}</p>
      </Card>
    </div>
  </AppMain>
</template>

<script lang="tsx" setup>
import { useSelect } from '../composables';

const {
  optionData,
  optionsGroup,
  optionDataVirtual,
  optionGroupVirtual,
  //
  paginationOption,
  cities,
  cityList,
  loading,
  getCityList,
  // 常规选择器
  singleVal,
  multipleVal,
  labelTemplVal,
  checkAllVal,
  groupVal,
  // 虚拟化选择器
  singleVirtualVal,
  multipleVirtualVal,
  groupValVal
} = useSelect();

/**
 * 选择器值变化
 * @param val
 */
const handleSelectChange = (val) => {
  console.log('新的值:', val);
};

const handkeCurrentChange = (currentPage: number, pageSize: number) => {
  console.log('切换分页current-change事件', currentPage, pageSize);
  getCityList(currentPage, pageSize);
};
</script>
