<template>
  <AppMain title="文件上传">
    <section class="p-3">
      <Card title="大文件上传">
        <el-upload :data="[fileDate]" :http-request="handleUploadFile">
          <el-button :loading="loading" :icon="Upload" type="primary" size="small">
            文件上传
          </el-button>
        </el-upload>
        <el-progress
          :percentage="progress"
          :stroke-width="8"
          striped
          :striped-flow="progress < 100"
          :duration="progress"
        />
        <div class="break-all text-sm mt-4">
          <p>路径: {{ fileDate?.path }}</p>
          <p>文件名: {{ fileDate?.filename }}</p>
        </div>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { Upload } from '@icon-park/vue-next';

import { useMultipartUpload } from '@modules/common/upload';

const { loading, progress, fileDate, handleUploadFile } = useMultipartUpload();
</script>
