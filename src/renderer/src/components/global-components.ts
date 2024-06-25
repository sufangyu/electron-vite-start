import { App, AsyncComponentLoader, defineAsyncComponent } from 'vue';

const allComponents = [
  { name: 'AppMain', component: () => import('./app-main/index') },
  { name: 'Card', component: () => import('./card/index') },
  { name: 'UploadExtend', component: () => import('./upload/index') }
];

export default function registerComponents(app: App<Element>) {
  allComponents.forEach((item) => {
    app.component(item.name, defineAsyncComponent(item.component as AsyncComponentLoader));
  });
}
