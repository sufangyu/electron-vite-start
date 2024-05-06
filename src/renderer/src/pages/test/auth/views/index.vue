<template>
  <AppMain title="权限控制">
    <section class="p-3">
      <Card title="按钮权限">
        <el-button v-if="AUTH_RESULT?.CREATE" size="small">新增</el-button>
        <el-button v-if="AUTH_RESULT?.EDIT" size="small">编辑</el-button>
        <el-button v-if="AUTH_RESULT?.DELETE" size="small">删除</el-button>
      </Card>

      <Card title="内容权限">
        <el-descriptions>
          <el-descriptions-item label="收件人:">kooriookami</el-descriptions-item>
          <el-descriptions-item label="手机号:">
            {{ AUTH_RESULT?.VIEW_MOBILE ? '18011111111' : '180****1111' }}
          </el-descriptions-item>
          <el-descriptions-item v-if="AUTH_RESULT?.VIEW_ADDRESS" label="地址:">
            广东省广州市～～～
          </el-descriptions-item>
        </el-descriptions>
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import AUTH_RESULT from '../permission';
</script>
