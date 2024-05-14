import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import frame, { FRAME_ROUTER_NAME } from '@modules/frame/router';
import video, { VIDEO_ROUTER_NAME } from '@modules/video/router';
import test, { TEST_ROUTER_NAME } from '@modules/test/router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: TEST_ROUTER_NAME.TEST_WINDOW },
    component: () => import('@layout/index'),
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
export { FRAME_ROUTER_NAME, VIDEO_ROUTER_NAME, TEST_ROUTER_NAME };
