# 表格组件

基于`el-table`组件封装, 增加列密度、显示列设置功能, 设置会缓存本地.

## 显示/隐藏列

**原理**

1. 根据 `el-table` 组件实例获取表格列数据（只取`el-table-column`设置了`prop`属性）, 根据获取的列数据（可能是缓存设置的值）配置列显示勾选项
2. 设置列显示隐藏后会更新`v-model:columnsHidden`的值
3. 表格组就可以根据`columnsHidden`, 给`el-table-column`通过设置`v-if="!columnsHidden.includes([propName])"`

**示例**

- Vue Template

```html
<TableExtend
  v-model:columnsHidden="columnsHidden"
  :data="tableData"
  border
  height="100%"
  :table-extend-attr="{
    class: 'table-extend-custom'
  }"
>
  <template #toolbar-left>
    <el-button type="primary" size="small" :icon="Plus">新增</el-button>
    <el-button type="danger" size="small">停用</el-button>
  </template>

  <template #default>
    <el-table-column fixed type="selection" width="50" align="center" />
    <el-table-column
      v-if="!columnsHidden.includes('index')"
      prop="index"
      label="序号"
      fixed
      type="index"
      width="60"
      align="center"
    />
    <el-table-column v-if="!columnsHidden.includes('name')" prop="name" label="姓名" width="100" />
    <el-table-column v-if="!columnsHidden.includes('date')" prop="date" label="日期" width="180" />
    <el-table-column
      v-if="!columnsHidden.includes('province')"
      label="省份"
      prop="province"
      width="120"
    />
    <el-table-column
      v-if="!columnsHidden.includes('city')"
      prop="city"
      label="城市"
      min-width="120"
    />
    <el-table-column
      v-if="!columnsHidden.includes('address')"
      prop="address"
      label="地址"
      min-width="350"
    />
    <el-table-column
      v-if="!columnsHidden.includes('operation')"
      prop="operation"
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
  </template>
</TableExtend>
```

- Script

```ts
// 隐藏的列属性名
const columnsHidden = ref<string[]>([]);
```

## 列密度

通过给`el-talbe`增加对应类型的 class, 默认 'default'

| 类型 | 值      |
| :--- | :------ |
| 默认 | default |
| 中等 | medium  |
| 紧凑 | small   |

## slots

| 插槽名        | 说明                 |
| :------------ | :------------------- |
| -             | 表格内容             |
| toolbar-left  | toolbar 左侧的内容   |
| toolbar-right | toolbar 右侧侧的内容 |
