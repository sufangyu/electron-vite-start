export enum VIDEO_ROUTER_NAME {
  /** 视频压缩 */
  VIDEO_COMPRESS = 'VideoCompress',
  /** 视频配置 */
  VIDEO_CONFIG = 'VideoConfig'
}

export default [
  {
    path: '/video',
    redirect: '/video/compress',
    component: () => import('@layout/index'),
    children: [
      {
        path: 'compress',
        name: VIDEO_ROUTER_NAME.VIDEO_COMPRESS,
        component: () => import('./views/video-compress/index.vue'),
        meta: { title: '视频压缩' }
      },
      {
        path: 'config',
        name: VIDEO_ROUTER_NAME.VIDEO_CONFIG,
        component: () => import('./views/video-config/index.vue'),
        meta: { title: '视频配置' }
      }
    ]
  }
];
