<template>
  <AppMain>
    <section class="p-4">
      <section class="mb-8">
        <h2 class="text-sm mb-2">基础窗口</h2>
        <div class="flex flex-wrap">
          <el-button size="small" @click="handleOpenWindow('1007')">ID: 1007</el-button>
          <el-button size="small" @click="handleOpenWindow('1008')">ID: 1008</el-button>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-sm mb-2">不同类型窗口</h2>
        <div class="flex flex-wrap">
          <el-button
            size="small"
            data-desc="☑️"
            @click="
              handleOpenWindow('9527', {
                module: 'test-size-limit',
                width: 350,
                height: 500,
                minWidth: 150,
                minHeight: 250,
                maxWidth: 450,
                maxHeight: 650,
                maximizable: false,
                titleBarStyle: 'hiddenInset',
                titleBarOverlay: {
                  height: 42
                }
              })
            "
          >
            限制大小
          </el-button>

          <el-button
            size="small"
            @click="
              handleOpenWindow('9527', {
                module: 'test-frame',
                frame: false,
                width: 350,
                height: 500,
                minWidth: 150,
                minHeight: 250
              })
            "
          >
            无框窗口
          </el-button>

          <el-button
            size="small"
            @click="
              handleOpenWindow('1007', {
                module: 'test-modal',
                modal: true,
                frame: false
              })
            "
          >
            模态窗口
          </el-button>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-sm mb-2">自定义工具栏窗口</h2>
        <div class="flex flex-wrap">
          <el-button
            size="small"
            @click="
              handleOpenCustomWindow({
                maximizable: true,
                center: true,
                title: '自定义工具栏标题-1',
                titleBarStyle: 'hidden',
                titleBarOverlay: {
                  height: 42
                }
              })
            "
          >
            同窗口
          </el-button>
          <el-button
            size="small"
            @click="
              handleOpenCustomWindow({
                url: '/test/window/tools?name=窗口2&type=2',
                maximizable: true,
                center: true,
                title: '自定义工具栏标题-2',
                titleBarStyle: 'hidden',
                titleBarOverlay: {
                  height: 40
                }
              })
            "
          >
            同窗口
          </el-button>
          <el-button
            size="small"
            @click="
              handleOpenCustomWindow({
                module: 'window-custom-other',
                url: '/test/window/tools',
                maximizable: true,
                center: true,
                title: '自定义工具栏标题-3',
                titleBarStyle: 'hidden',
                titleBarOverlay: {
                  height: 42
                }
              })
            "
          >
            新窗口
          </el-button>
        </div>
      </section>

      <section class="mb-8">
        <h2 class="text-sm mb-2">外部站点</h2>
        <div class="flex flex-wrap">
          <el-button size="small" @click="handleOpenExternalWindow('ithome')">ithome</el-button>
          <el-button size="small" @click="handleOpenExternalWindow('36kr')">36kr</el-button>
        </div>
      </section>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { type CreateWindowOptions } from '@share/modules';
import AppMain from '@components/app-main/index.vue';

const handleOpenWindow = async (id: string, options?: CreateWindowOptions) => {
  window.api?.openWindow?.({
    module: 'test',
    url: `/test/${id}`,
    width: 500,
    height: 420,
    maximizable: false,
    frame: true,
    ...options
  });
};

const handleOpenCustomWindow = async (options?: Partial<CreateWindowOptions>) => {
  // TODO: URL 中增加窗口类型参数，以便在窗口所使用页面布局获取从而可针对性的渲染、适配、特殊处理等
  window.api?.openWindow?.({
    module: 'window-custom',
    url: '/test/window/tools?name=窗口1',
    ...options
  });
};

const handleOpenExternalWindow = async (name: string) => {
  const urlMap = {
    ithome: 'https://www.ithome.com',
    '36kr': 'https://www.36kr.com'
  };
  window.api?.openWindow?.({
    module: 'ithome',
    url: urlMap[name],
    width: 1024,
    height: 768,
    maximizable: false,
    center: true,
    frame: true
  });
};
</script>

<style lang="scss" scoped></style>
