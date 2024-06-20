import { Campus, Housing } from './university'

export interface Favorite {
  favorite_id: string
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
