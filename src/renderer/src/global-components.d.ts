import { ElUpload } from 'element-plus';

import AppMain from '@components/app-main/index';
import Card from '@components/card/index';
import UploadExtend from '@components/upload/index';
import UploadSimple from '@components/upload-simple/index';

declare module 'vue' {
  export interface GlobalComponents {
    AppMain: typeof AppMain;
    Card: typeof Card;
    // 扩展属性 & 原上传组件属性
    UploadExtend: typeof UploadExtend & typeof ElUpload;
    UploadSimple: typeof UploadSimple & typeof ElUpload;
  }
}

export {};
