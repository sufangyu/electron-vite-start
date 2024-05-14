// 这里只是为了演示如何使用按钮权限, 实际情况是应该在 module 下维护的
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
