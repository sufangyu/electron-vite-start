<template>
  <AppPage
    class="p-3"
    :aside-width="200"
    :aside-style="{ marginRight: '8px', fontSize: '13px' }"
    :header="{
      row: { gutter: 10 },
      col: {
        xs: 24,
        sm: 8,
        md: 8,
        lg: 8,
        xl: 61
      }
    }"
  >
    <template #aside-header>
      <div class="bg-slate-500/20 mb-1 h-10 leading-10 text-center">侧边头部</div>
    </template>

    <template #aside-body>
      <div class="bg-slate-500/20">
        <div class="h-[250px] leading-[250px] text-center">侧边主内容-1</div>
        <div class="h-[250px] leading-[250px] text-center">侧边主内容-2</div>
        <div class="h-[250px] leading-[250px] text-center">侧边主内容-3</div>
        <div class="h-[250px] leading-[250px] text-center">侧边主内容-4</div>
      </div>
    </template>

    <template #aside-footer>
      <div class="bg-slate-500/20 mt-1 h-10 leading-10 text-center">侧边底部</div>
    </template>

    <template #header="{ collapse }">
      <el-form size="small" label-width="80px">
        <el-form-item label="用户名:">
          <el-input v-model="query.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="状态:">
          <template #label="{ label }">
            <LabelTooltip :label="label" :tooltip="{ content: '这是解释说明的文本内容' }" />
          </template>
          <el-select v-model="query.state" placeholder="请选择">
            <el-option
              v-for="(item, idx) in [
                { label: '全部', value: '' },
                { label: '待审核', value: 'await' },
                { label: '已通过', value: 'passed' },
                { label: '未通过', value: 'failed' }
              ]"
              :key="idx"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="collapse" label="创建日期:">
          <el-date-picker
            v-model="query.createdDate"
            type="daterange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(1970, 0, 1, 0, 0, 0), new Date(1970, 0, 1, 23, 59, 59)]"
            :disabled-date="(time: Date) => time.getTime() < Date.now() - 8.64e7"
          />
        </el-form-item>
        <el-form-item v-show="collapse" label="地区:">
          <el-cascader
            v-model="query.area"
            :options="areaOptions"
            placeholder="请选择"
            style="width: 100%"
            :props="{
              checkStrictly: false, // 不要求节点的子节点必须全选中
              emitPath: true // 返回完整路径值
            }"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
      <div class="text-xs px-3">头部搜索区域其他内容</div>
    </template>

    <template #body-extend>
      <div class="flex justify-between">
        <div class="flex items-center gap-2 text-xs">
          <el-button type="primary" size="small" :icon="Plus">新增</el-button>
          <span>当前第{{ query.pageNum }}页</span>
          <span>每页{{ query.pageSize }}条数据</span>
        </div>
        <div class="flex items-center gap-2">
          <el-tooltip content="列表密度" placement="top">
            <el-dropdown trigger="click">
              <el-button link :icon="RowHeight"></el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>默认</el-dropdown-item>
                  <el-dropdown-item>中等</el-dropdown-item>
                  <el-dropdown-item>紧凑</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </el-tooltip>
          <el-tooltip content="列设置" placement="top">
            <el-button link :icon="SettingTwo"></el-button>
          </el-tooltip>
        </div>
      </div>
    </template>

    <!-- 非内容, 用于测试设置 bodyScrollbar=true 时是否有滚动条 -->
    <!-- <div class="h-[250px] bg-red-700/65">1</div>
    <div class="h-[250px] bg-red-700/65">2</div>
    <div class="h-[250px] bg-red-700/65">3</div>
    <div class="h-[250px] bg-red-700/65">4</div>
    <div class="h-[250px] bg-red-700/65">5</div>
    <div class="bg-blue-700/65">6</div> -->

    <el-table :data="tableData" style="width: 100%" height="100%">
      <el-table-column prop="name" label="姓名" width="100">
        <template #default="{ row, $index }"> {{ row.name }}-{{ $index + 1 }} </template>
      </el-table-column>
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="province" label="省份" width="120"> </el-table-column>
      <el-table-column prop="city" label="市区" width="120"> </el-table-column>
      <el-table-column prop="address" label="地址" width="350"> </el-table-column>
      <el-table-column prop="zip" label="ZIP" width="120"> </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        :resizable="false"
        :width="adjustWidth({ className: 'operation-actions' })"
      >
        <template #header="{ column }">
          <LabelTooltip
            :label="column.label"
            :tooltip="{ placement: 'right' }"
            :tool-tip-icon="Helpcenter"
          >
            <template #content>这是自定义的解释文本</template>
          </LabelTooltip>
        </template>

        <template #default="{ $index }">
          <div class="operation-actions" style="white-space: nowrap; display: inline-block">
            <el-button v-if="[1, 2, 4].includes($index)" size="small" type="primary">
              退回
            </el-button>
            <el-button v-if="[2].includes($index)" size="small" type="primary">审核</el-button>
            <el-button size="small" type="danger">删除</el-button>
            <el-button size="small" type="default">启用</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <Pagination
        v-model:current-page="query.pageNum"
        v-model:page-size="query.pageSize"
        :total="250"
        class="p-2 flex justify-center"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </template>
  </AppPage>
</template>

<script lang="ts" setup>
import { Plus, RowHeight, SettingTwo, Helpcenter } from '@icon-park/vue-next';

import { useTable } from '@core/hooks';

const { adjustWidth } = useTable();

const query = ref({
  username: '',
  state: '',
  createdDate: ['', ''],
  area: '',
  pageNum: 1,
  pageSize: 10
});
const tableData = Array(50).fill({
  date: '2016-05-02',
  name: '王小虎',
  province: '上海',
  city: '普陀区',
  address: '上海市普陀区金沙江路 1518 弄',
  zip: 200333,
  age: 10
});
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
  query.value.pageNum = val;
};

const areaOptions = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      {
        label: '杭州',
        value: 'hangzhou',
        children: [
          { label: '西湖区', value: 'xihu' },
          { label: '上城区', value: 'shangcheng' }
        ]
      },
      {
        label: '宁波',
        value: 'ningbo',
        children: [
          { label: '海曙区', value: 'haishu' },
          { label: '江北区', value: 'jiangbei' }
        ]
      }
    ]
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [
      {
        label: '南京',
        value: 'nanjing',
        children: [
          { label: '玄武区', value: 'xuanwu' },
          { label: '秦淮区', value: 'qinhuai' }
        ]
      },
      {
        label: '苏州',
        value: 'suzhou',
        children: [
          { label: '姑苏区', value: 'gusu' },
          { label: '吴中区', value: 'wuzhong' }
        ]
      }
    ]
  }
];
</script>
