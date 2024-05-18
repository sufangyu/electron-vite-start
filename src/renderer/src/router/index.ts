import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

import frameRouter, { FRAME_ROUTER_NAME } from '@modules/frame/router';
import testRouter, { TEST_ROUTER_NAME } from '@modules/test/router';
import videoRouter, { VIDEO_ROUTER_NAME } from '@modules/video/router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: TEST_ROUTER_NAME.TEST_WINDOW },
    component: () => import('@layout/index'),
    children: []
  },
  ...videoRouter,
  ...testRouter,
  ...frameRouter,
  {
    path: '/:anyPath(.*)*',
    name: FRAME_ROUTER_NAME.NOT_FOUND,
    component: () => import('@modules/frame/exception/views/404.vue'),
    meta: {
      title: '页面不存在'
    }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
export { FRAME_ROUTER_NAME, VIDEO_ROUTER_NAME, TEST_ROUTER_NAME };
