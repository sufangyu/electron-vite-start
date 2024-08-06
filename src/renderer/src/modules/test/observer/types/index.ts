export interface GetRequestReq {
  title?: string;
  startDate?: string;
  endDate?: string;
  pageNum: number;
  pageSize: number;
}

export interface GetRequestListItem {
  id?: number;
  title?: string;
  updated?: number;
  createdAt?: string;
}
export interface GetRequestRes {
  list: GetRequestListItem[];
  page: number;
  size: number;
  pages: number;
  total: number;
}
