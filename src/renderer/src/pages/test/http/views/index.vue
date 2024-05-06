<template>
  <AppMain title="网络请求">
    <section class="p-3">
      <Card title="基础使用">
        <el-button size="small" @click="handleGetRequest">GET</el-button>
        <el-button size="small" @click="handlePostRequest">POST</el-button>
        <el-button size="small" @click="handlPutRequest">PUT</el-button>
        <el-button size="small" @click="handleDeleteRequest">DELETE</el-button>
        <el-button size="small" @click="handleBaseRequest">通用</el-button>
      </Card>

      <Card title="响应结果">
        <el-button size="small" @click="handleResponseResult('success')">成功</el-button>
        <el-button size="small" @click="handleResponseResult('fail')">失败</el-button>
      </Card>

      <Card title="HTTP 状态码">
        <el-button size="small" @click="handleRequestStatus(200)">200</el-button>
        <el-button size="small" @click="handleRequestStatus(401)">401</el-button>
        <el-button size="small" @click="handleRequestStatus(403)">403</el-button>
        <el-button size="small" @click="handleRequestStatus(404)">404</el-button>
        <el-button size="small" @click="handleRequestStatus(500)">500</el-button>
      </Card>

      <Card title="其他">
        <el-button size="small" @click="handleDownloadFile('bolb')"> 文件下载（Bolb） </el-button>
        <el-button size="small" plain @click="handleDownloadFile('json')">
          文件下载（JSON）
        </el-button>
      </Card>

      <Card title="Hooks">
        <el-button size="small" :loading="loadingGet" @click="handleBaseRequestGet">
          通用 Hooks（GET）
        </el-button>
        <div class="text-sm mt-2 leading-6">
          <p>请求参数: {{ paramsGet }}</p>
          <p>请求中: {{ loadingGet }}</p>
          <p>状态结果: {{ resultStatusGet }}</p>
          <p>数据结果: {{ dataGet ?? [] }}</p>
        </div>

        <el-divider />
        <el-button size="small" :loading="loadingPost" @click="handleBaseRequestPost">
          通用 Hooks（POST）
        </el-button>
        <div class="text-sm mt-2 leading-6">
          <p>请求参数: {{ paramsPost }}</p>
          <p>请求中: {{ loadingPost }}</p>
          <p>状态结果: {{ resultStatusPost }}</p>
          <p>数据结果: 姓名-{{ dataPost?.name }}, 年龄-{{ dataPost?.age }}</p>
        </div>

        <el-divider />
        <el-button size="small" @click="handleSearch()">列表查询</el-button>
        <el-button size="small" @click="handleCurrentChange(paramsForList.pageNum - 1)">
          上一页
        </el-button>
        <el-button size="small" @click="handleCurrentChange(paramsForList.pageNum + 1)">
          下一页
        </el-button>
        <el-button size="small" @click="handleReset()">重置</el-button>
        <el-button
          size="small"
          @click="
            () => {
              paramsForList.title = '最';
              handleSearch();
            }
          "
        >
          标题包含“最”
        </el-button>
        <el-button size="small" @click="handleSizeChange(20)">每页查20条</el-button>
        <div class="text-sm mt-2 leading-6">
          <p>请求中: {{ loadingList }}</p>
          <p>查询条件: {{ paramsForList }}</p>
          <p>状态结果: {{ resultStatusList }}</p>
          <p>
            数据结果: 当前第{{ paramsForList.pageNum }}页有{{ list.length }}条, 总共{{
              listTotal
            }}条记录
          </p>
        </div>
        <el-divider />
      </Card>
    </section>
  </AppMain>
</template>

<script lang="ts" setup>
import { useRequestMethod, useRequestOthter, useRequestHooks } from '@modules/http/index';

const {
  handleGetRequest,
  handlePostRequest,
  handlPutRequest,
  handleDeleteRequest,
  handleBaseRequest
} = useRequestMethod();

const { handleResponseResult, handleRequestStatus, handleDownloadFile } = useRequestOthter();

const {
  // BaseRequestHooks-GET
  paramsGet,
  loadingGet,
  resultStatusGet,
  dataGet,
  handleBaseRequestGet,

  // BaseRequestHooks-POST
  paramsPost,
  loadingPost,
  resultStatusPost,
  dataPost,
  handleBaseRequestPost,

  // ListRequestHooks-LIST
  paramsForList,
  list,
  listTotal,
  loadingList,
  resultStatusList,
  handleSearch,
  handleReset,
  handleCurrentChange,
  handleSizeChange
} = useRequestHooks();
</script>

<style lang="scss" scoped></style>
