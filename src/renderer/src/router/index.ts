import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import frame from '@renderer/pages/frame/router';
import video, { VIDEO_ROUTER_NAME } from '@renderer/pages/video/router';
import test, { TEST_ROUTER_NAME } from '@renderer/pages/test/router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'VideoCompress' },
    component: () => import('@renderer/layout'),
    children: []
  },
  ...video,
  ...test,
  ...frame
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
export { VIDEO_ROUTER_NAME, TEST_ROUTER_NAME };
