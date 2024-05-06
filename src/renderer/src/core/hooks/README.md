# 内置 Hooks

## 主题切换

提供浅色、深色、跟随系统的主题切换.

## 通用请求

提供 loading、响应结果状态、请求触发方法的返回, 并且提供了请求前的参数处理、参数校验请求会的数据处理的回调函数传参.

**函数调用**
```ts
useBaseRequest<T = any, P = any>(options);
```
- T: 请求返回值类型
- P: 参数类型
- options: 请求参数

**函数返回值**
- loading: 是否请求中
- resultStatus: 请求响应结果
- data: 响应结果数据
- handleRequest: 触发请求函数


**GET 示例**
> src/renderer/src/modules/http/composables/use-request-hooks.ts
```ts
import { useBaseRequest } from '@core/hooks';
import { getSearchRequest } from '../api';

const {
  loading,
  resultStatus,
  data,
  handleRequest
} = useBaseRequest<Types.GetRequestListItem[], number>({
  request: {
    api: getSearchRequest,
    params: 2,
    handleParams: (args) => {
      console.log('处理参数 =>', args);
      return args ?? -1;
    },
    handleValidate: (args) => {
      console.log('校验参数 =>', args);
      return typeof args === 'number';
    }
  }
});

// 触发请求
handleRequest();
```

**POST示例**
> src/renderer/src/modules/http/composables/use-request-hooks.ts
```ts
import { useBaseRequest } from '@core/hooks';
import { postRequest } from '../api';

const {
  loading,
  resultStatus,
  data,
  handleRequest
} = useBaseRequest<Types.PostRequestRes, PostParams>({
  request: {
    api: postRequest,
    params: {
      name: '  李四  x  ',
      age: 20,
      hobbyList: ['⚽️', '🏀'],
      // 测试删除前后空格
      test: {
        deep: {
          name: '  李四  x  ',
          deepNext: {
            class: '  -  数学  -      '
          }
        }
      }
    },
    handleParams: (args) => {
      console.log('处理参数 =>', args);
      args.hobby = args.hobbyList?.join(',');

      delete args.hobbyList;
      return args ?? {};
    },
    handleValidate: (args) => {
      console.log('校验参数 =>', args);
      if ((args.hobbyList ?? []).length === 0) {
        throw new Error('兴趣信息不能为空');
      }

      return true;
    }
  },
  response: {
    handleResponseData(data) {
      console.log('处理响应结果 =>>', data);
      return data!;
    }
  }
});

// 触发请求
handleRequest();
```

## 列表请求

提供 loading、响应结果状态、列表查询、的返回, 并且提供了请求前的参数处理、参数校验请求会的数据处理的回调函数传参。

**函数调用**
```ts
useListRequest<T = any, P = any, L = any>(options);
```
- T: 请求返回值类型
- P: 参数类型
- L: 请求列表 Item 类型
- options: 请求参数

**函数返回值**
- params: 请求参数
- loading: 是否请求中
- resultStatus: 请求响应结果
- list: 列表数据
- listTotal: 列表总条数
- handleSearch: 搜索方法
- handleReset: 重置方法
- handleCurrentChange: 页面切换查询方法
- handleSizeChange: 页面条数切换查询方法


**列表示例**
```ts
import { useListRequest } from '@core/hooks';
import { getRequest } from '../api';

const {
  params,
  list,
  listTotal,
  loading,
  resultStatus,
  handleSearch,
  handleReset,
  handleCurrentChange,
  handleSizeChange
} = useListRequest<Types.GetRequestRes, ListParams, Types.GetRequestListItem>({
  isUpdatePageUrl: true,
  request: {
    api: getRequest,
    params: {
      title: '',
      startDate: '',
      endDate: '',
      dateArr: ['2024-05-01', '2024-06-30'],
      pageNum: 1,
      pageSize: 10
    },
    handleValidate: (args) => {
      console.log('校验列表参数 =>', args);

      if ((args.dateArr ?? []).length === 0) {
        throw new Error('创建日期不能为空');
      }

      const [startDate, endDate] = args.dateArr ?? ['', ''];
      if (!startDate || !endDate) {
        throw new Error('创建日期开始或结束时间不能为空');
      }

      return true;
    },
    handleParams: (args) => {
      console.log('处理列表参数 =>', args);
      const [startDate, endDate] = args.dateArr ?? ['', ''];
      args.startDate = startDate;
      args.endDate = endDate;
      delete args.dateArr;
      return args;
    },
    handleCustomResetParams: (args) => {
      console.log('重置参数 =>', args);
      // args.dateArr = ['', ''];
      return args;
    }
  },
  response: {
    handleResponseData(list) {
      const newList = (list ?? []).map((it) => {
        it.updated = +new Date();
        return it;
      });
      console.log('处理列表结果 =>>', newList);
      return newList;
    }
  }
});
```



## 文件下载

提供基于 `axios` 实现的 `blob` 文件流格式的文件下载, 支持前端设置文件名称。

**获取文件名规则**
1. 先使用前端设置的文件名
2. 再使用接口响应头的文件名
3. 最后使用请求路径的文件信息

**使用示例**
```ts
try {
  await downloadByBlob({
    url: 'url',
    filename: '前端文件名'
  });
} catch (error) {
  const errMsg = error instanceof Error ? error.message : error;
  console.error(`导出失败-${errMsg}`);
}
```



## 权限（按钮、内容）

为简化、统一管理按钮、内容等权限控制，提供方法通过传入当前模块的权限配置与当前用户匹对, 获取每个权限对应的结果.

**结果说明:**

- `true`: 表示有权限
- `false`: 表示没有权限

**使用示例**

1. 模块的 `permission/index.ts` 文件
```ts
import { useAuth } from '@core/hooks';

// 权限配置
const PEEMISSION = Object.freeze({
  CREATE: 'test:create',
  EDIT: 'test:edit',
  DELETE: 'test:delete',
  VIEW_ADDRESS: 'test:view-address',
  VIEW_MOBILE: 'test:view-mobile'
});

const { AUTH_RESULT } = useAuth(PEEMISSION);

export default AUTH_RESULT;
```

2. 页面应用
```html
<!-- 普通类型 -->
<el-button v-if="AUTH_RESULT?.CREATE">新增</el-button>
<el-button v-if="AUTH_RESULT?.EDIT">编辑</el-button>
<el-button v-if="AUTH_RESULT?.DELETE">删除</el-button>

<!-- 权限控制显示不同内容 -->
<el-descriptions>
  <el-descriptions-item label="手机号:">
    {{ AUTH_RESULT?.VIEW_MOBILE ? '18011111111' : '180****1111' }}
  </el-descriptions-item>
</el-descriptions>
```

> ⚠️注意:
> 
> 不使用封装权限组件方法是因为有权限控制的内容如果存在 `slot` 渲染内容可能会出现无法显示的问题, 如以下代码 `<template slot="label">地址:</template>` 的内容无法显示.
> 
>```html
><el-descriptions>
>  <Authority :auth="AUTH_RESULT.VIEW_MOBILE">
>    <el-descriptions-item>
>      <template slot="label">地址:</template>
>      广东省广州市海珠区
>    </el-descriptions-item>
>  </Authority>
></el-descriptions>
>```