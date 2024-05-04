import { deleteRequest, getRequest, postRequest, putRequest, baseRequest } from '../api';

// 不同请求方法
export default () => {
  const handleGetRequest = async () => {
    const { data } = await getRequest({
      pageNum: 1,
      pageSize: 10
    });
    console.log('[RENDER_REQUEST] GET 请求结果:', data);
  };
  const handlePostRequest = async () => {
    const { data } = await postRequest({ name: '张三疯', age: 29 });
    console.log('[RENDER_REQUEST] POST 请求结果:', data);
  };
  const handlPutRequest = async () => {
    const result = await putRequest({ id: '1007' });
    console.log('[RENDER_REQUEST] PUT 请求结果:', result);
  };
  const handleDeleteRequest = async () => {
    const result = await deleteRequest('1007');
    console.log('[RENDER_REQUEST] DELETE 请求结果:', result);
  };
  const handleBaseRequest = async () => {
    const { data } = await baseRequest('1007', {
      course: 'TS',
      hobby: ['钓鱼', '娱乐']
    });
    console.log('[RENDER_REQUEST] 通用请求结果:', data);
  };

  return {
    handleGetRequest,
    handlePostRequest,
    handlPutRequest,
    handleDeleteRequest,
    handleBaseRequest
  };
};
