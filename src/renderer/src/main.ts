import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// plugins
import '@core/plugins';
// global components
import components from '@components/global-components';

// app view、router、styles
import App from './App.vue';
import router from './router/index';
import './assets/tailwind.css';
import './assets/main.scss';

const app = createApp(App);
const pinia = createPinia();

pinia.use(
  createPersistedState({
    key: (id) => `${import.meta.env.RENDERER_VITE_PRE_STORE_KEY}${id}`
  })
);
app
  .use(pinia)
  .use(router)
  .use(ElementPlus, {
    locale: zhCn
  })
  .use(components)
  .mount('#app');
