<template>
  <AppMain title="字典表">
    <div class="p-3">
      <Card title="异步查询">
        <div class="flex gap-4">
          <div class="flex-1">
            <el-select v-model="singleVal" placeholder="请选择">
              <el-option
                v-for="item in dictionaryList(DICT_CODE_ENUM.工作)"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <p class="text-sm mt-2">
              选择结果:
              {{ formatDictionaryLabel(DICT_CODE_ENUM.工作, singleVal) }}（{{ singleVal }}）
            </p>
          </div>

          <div class="flex-1">
            <el-cascader
              v-model="multiVal"
              placeholder="请选择"
              :options="dictionaryTree(DICT_CODE_ENUM.互联网)"
              collapse-tags
              collapse-tags-tooltip
              :max-collapse-tags="2"
              :props="{
                multiple: true,
                checkStrictly: true,
                emitPath: false
              }"
              :show-all-levels="false"
              style="width: 100%"
            />
            <p class="text-sm mt-2">
              选择结果:
              {{ formatDictionaryLabelList(DICT_CODE_ENUM.互联网, multiVal) }}（{{ multiVal }}）
            </p>
          </div>
        </div>
      </Card>

      <Card title="同步查询">
        <el-button :loading="isLoading" @click="handleAsync">同步查询</el-button>
      </Card>

      <Card title="自定义 Cascader 组件">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <CascaderCate
              v-model="categories"
              :max-collapse-tags="2"
              :props="{
                multiple,
                checkStrictly: true,
                emitPath: false
              }"
              :show-all-levels="false"
              style="width: 100%"
            />
          </div>
          <div class="flex-1">
            {{ categories }}
          </div>
        </div>
      </Card>
    </div>
  </AppMain>
</template>

<script lang="tsx" setup>
import { useDictionary } from '@renderer/core/hooks';

import { getDictList } from '../api';
import CascaderCate from '../components/cascader-cate.vue';
import { DICT_CODE_ENUM } from '../enums';

// 异步请求 & 格式化显示 ------------------------------------------------------------------------------------
const { dictionaryList, dictionaryTree, formatDictionaryLabel, formatDictionaryLabelList } =
  useDictionary<DICT_CODE_ENUM>({
    dictOptions: [
      { code: DICT_CODE_ENUM.互联网, maxLevel: 1 },
      { code: DICT_CODE_ENUM.工作, maxLevel: 0 }
    ],
    apiFunc: getDictList
  });

const singleVal = ref<string>('');
const multiVal = ref<string[]>([]);

// 同步请求 ------------------------------------------------------------------------------------
const { loadDictionary, isLoading } = useDictionary<DICT_CODE_ENUM>({
  dictOptions: [{ code: DICT_CODE_ENUM.工作 }],
  immediate: false,
  apiFunc: getDictList
});

const handleAsync = async () => {
  const data = await loadDictionary();
  console.log('同步查询结果:', data);
};

// 自定义 Cascader 组件 ------------------------------------------------------------------------------------
const categories = ref<string | string[]>([]);
const multiple = true;
setTimeout(() => {
  categories.value = multiple ? ['117', '113'] : '117';
}, 1250);
</script>
