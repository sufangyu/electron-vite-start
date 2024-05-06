import { App, AsyncComponentLoader, defineAsyncComponent } from 'vue';

const components = [
  { name: 'AppMain', component: () => import('./app-main/index.vue') },
  { name: 'Card', component: () => import('./card.vue') }
];

export default function install(app: App<Element>) {
  components.forEach((item) => {
    app.component(item.name, defineAsyncComponent(item.component as AsyncComponentLoader));
  });
}
