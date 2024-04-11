// Datafetching
// https://www.youtube.com/watch?v=00lxm_doFYw

export interface University {
    university_id: string;
    country_code: string;
    region: string;
    long_name: string;
    info_page_id: string;
}
export interface User {
  user_id: string;
  username: string;
  pwd: string;
  nationality: string;
  home_university: string;
}

export interface Users {
  user: User[];
}

