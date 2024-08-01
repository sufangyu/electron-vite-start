import { App, AsyncComponentLoader, defineAsyncComponent } from 'vue';

const allComponents = [
  { name: 'AppMain', component: () => import('./app-main/index') },
  { name: 'AppPage', component: () => import('./app-page/index') },
  { name: 'Pagination', component: () => import('./pagination/index') },
  { name: 'TableExtend', component: () => import('./table/index') },
  { name: 'SelectExtend', component: () => import('./select/index') },
  { name: 'Card', component: () => import('./card/index') },
  { name: 'LabelTooltip', component: () => import('./label-tooltip/index') },
  { name: 'QRCode', component: () => import('./qr-code/index') },
  { name: 'UploadExtend', component: () => import('./upload/index') },
  { name: 'UploadSimple', component: () => import('./upload-simple/index') }
];

export default function registerComponents(app: App<Element>) {
  allComponents.forEach((item) => {
    app.component(item.name, defineAsyncComponent(item.component as AsyncComponentLoader));
  });
}
