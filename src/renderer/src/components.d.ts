import AppMain from '@components/app-main/index.vue';
import Card from '@components/card.vue';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    AppMain: typeof AppMain;
    Card: typeof Card;
  }
}

export {};
