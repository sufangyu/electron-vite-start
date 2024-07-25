import { ElUpload, ElPagination, ElTable } from 'element-plus';

import AppMain from '@components/app-main/index';
import AppPage from '@components/app-page/index';
import Card from '@components/card/index';
import LabelTooltip from '@components/label-tooltip/index';
import Pagination from '@components/pagination/index';
import QRCode from '@components/qr-code/index';
import TableExtend from '@components/table/index';
import UploadExtend from '@components/upload/index';
import UploadSimple from '@components/upload-simple/index';

declare module 'vue' {
  export interface GlobalComponents {
    AppMain: typeof AppMain;
    AppPage: typeof AppPage;
    Pagination: typeof Pagination & typeof ElPagination;
    TableExtend: typeof TableExtend & typeof ElTable;
    Card: typeof Card;
    LabelTooltip: typeof LabelTooltip;
    QRCode: typeof QRCode;
    // 扩展属性 & 原上传组件属性
    UploadExtend: typeof UploadExtend & typeof ElUpload;
    UploadSimple: typeof UploadSimple & typeof ElUpload;
  }
}

export {};
