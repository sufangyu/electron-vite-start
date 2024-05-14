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
}
export interface GetRequestRes {
  list: GetRequestListItem[];
  page: number;
  size: number;
  pages: number;
  total: number;
}

export interface PostRequestReq {
  name: string;
  age?: number;
}
export interface PostRequestRes {
  name?: string;
  age?: number;
}

export interface PutRequestReq {
  id: string;
  mode?: string;
}
export interface PutRequestRes {
  id: string;
}

export interface BaseRequestReq {
  course: string;
  hobby: string[];
}
export interface BaseRequestRes {
  id: string;
  course: string;
  hobby: string[];
}
