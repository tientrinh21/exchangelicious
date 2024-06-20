// Data fetching
// https://www.youtube.com/watch?v=00lxm_doFYw

export enum Campus {
  single = 'single',
  multiple = 'multiple',
  nan = 'N/A',
}

export enum Housing {
  onCampus = 'On-campus',
  offCampus = 'Off-campus',
  noHousing = 'No housing',
  housingAvailable = 'Available',
  nan = 'N/A',
}

export interface University {
  university_id: string
  country_name: string
  country_code: string
  region: string
  long_name: string
  ranking: string
  housing: Housing
  campus: Campus
  info_page_id: string
}

export interface UniversityInfo {
  info_page_id: string
  webpage: string
  introduction: string
  location: string
  semester: string
  application_deadlines: string
  courses: string
  housing: string
  expenses: string
  visa: string
  eligibility: string
  requirements: string
  additional_information: string
}
