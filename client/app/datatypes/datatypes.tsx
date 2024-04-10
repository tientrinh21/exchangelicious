// Datafetching
// https://www.youtube.com/watch?v=00lxm_doFYw
export interface User {
  // user_id: string;
  username: string;
  password: string
}

export interface Users {
  user: User[];
}
