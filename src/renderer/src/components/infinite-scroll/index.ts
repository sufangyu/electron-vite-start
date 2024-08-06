import { withInstall } from '@core/utils';

import InfiniteScrollComp from './package/index.vue';

export const InfiniteScroll = withInstall(InfiniteScrollComp);
export default InfiniteScroll;
export * from './package/types';
