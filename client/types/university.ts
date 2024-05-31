// Data fetching
// https://www.youtube.com/watch?v=00lxm_doFYw

export interface University {
  university_id: string
  country_name: string
  country_code: string
  region: string
  long_name: string
  ranking: string
  housing: boolean
  campus: string
  info_page_id: string
}

export interface UniversityInfo {
  // university_id: string
  // country_code: string
  // region: string
  // long_name: string
  // info_page_id: string
  webpage: string
  introduction: string
  location: string
  semester: string
  application_deadlines: string
  courses: string
  housing: string
  tuition: string
  visa: string
  eligibility: string
  requirements: string
}
