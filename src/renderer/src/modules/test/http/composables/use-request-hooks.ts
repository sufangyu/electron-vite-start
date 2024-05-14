import { useBaseRequest, useListRequest } from '@core/hooks';
import { getSearchRequest, getRequest, postRequest } from '../api';
import * as Types from '../types';

interface ListParams extends Types.GetRequestReq {
  dateArr?: [string, string];
}

interface PostParams extends Types.PostRequestRes {
  hobby?: string;
  hobbyList?: string[];
  test?: Record<string, object>;
}

// 请求 Hooks
export default () => {
  // 通用 Hooks（GET）
  const {
    params: paramsGet,
    loading: loadingGet,
    resultStatus: resultStatusGet,
    data: dataGet,
    handleRequest: handleBaseRequestGet
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

  // 通用 Hooks（POST）
  const {
    params: paramsPost,
    loading: loadingPost,
    resultStatus: resultStatusPost,
    data: dataPost,
    handleRequest: handleBaseRequestPost
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

  // 列表 Hooks
  const {
    params: paramsForList,
    list,
    listTotal,
    loading: loadingList,
    resultStatus: resultStatusList,
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
      handleCustomResetParams: (oldArgs, newArgs) => {
        console.log('重置参数 =>', oldArgs, newArgs);
        // args.dateArr = ['', ''];
        return {
          ...oldArgs,
          ...newArgs
        };
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

  return {
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
  };
};
