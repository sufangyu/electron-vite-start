<template>
  <AppMain title="监听器">
    <div class="p-3">
      <Card title="元素是否进入可视区域">
        <el-scrollbar class="h-[250px] overflow-y-auto">
          <div class="placeholder-item">占位元素</div>
          <div class="placeholder-item">占位元素</div>
          <div ref="target1" class="placeholder-item">被监听元素1</div>
          <div ref="target2" class="placeholder-item">被监听元素2</div>
          <div class="placeholder-item">占位元素</div>
          <div class="placeholder-item">占位元素</div>
        </el-scrollbar>
      </Card>

      <Card title="图片懒加载">
        <el-scrollbar class="h-[250px] overflow-y-auto demo-image__lazy">
          <img v-for="url in urls" :key="url" v-lazyload="{ url }" />
        </el-scrollbar>
      </Card>

      <Card title="无限加载列表">
        <div class="h-[300px] overflow-y-hidden">
          <InfiniteScroll :status="status" :empty="isEmpty" @load-more="loadMore">
            <div
              v-for="(item, idx) in list"
              :key="idx"
              class="flex text-sm p-2 border-b border-gray-400/50"
            >
              <span class="w-64">{{ `【${idx + 1}】 ${item.title}` }}</span>
              <span class="text-xs opacity-50">发布时间: {{ item.createdAt }}</span>
            </div>
          </InfiniteScroll>
        </div>
      </Card>
    </div>
  </AppMain>
</template>

<script lang="ts" setup>
import { useVisiable, useLazyload, useList } from '../composables';

const { target1, target2 } = useVisiable();
const { urls } = useLazyload();
const { status, isEmpty, list, loadMore } = useList();
</script>

<style lang="scss" scoped>
.placeholder-item {
  @apply h-[200px] leading-[200px] text-center bg-gray-500/50 my-2 text-sm;
}

.demo-image__lazy .el-image,
.demo-image__lazy img {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}
.demo-image__lazy .el-image:last-child,
.demo-image__lazy img:last-child {
  margin-bottom: 0;
}
</style>
