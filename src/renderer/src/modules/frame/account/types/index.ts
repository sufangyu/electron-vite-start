export interface AccountLoginReq {
  username: string;
  password: string;
}

export interface AccountLoginRes extends Account {}

export interface Account {
  userInfo: {
    id: string;
    username: string;
    email?: string;
  };
  accessToken: string;
  refreshToken: string;
}
