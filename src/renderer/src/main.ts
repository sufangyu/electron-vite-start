import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

// element ui
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

// router
import router from './router/index';

import App from './App.vue';
import './assets/tailwind.css';
import './assets/main.scss';

const app = createApp(App);
const pinia = createPinia();

pinia.use(
  createPersistedState({
    key: (id) => `${import.meta.env.RENDERER_VITE_PRE_STORE_KEY}${id}`
  })
);
app.use(pinia);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn
});
app.mount('#app');
