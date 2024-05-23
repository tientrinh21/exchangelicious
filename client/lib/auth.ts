import { type University } from '@/types/university'
import { type User } from '@/types/user'
import { atom, useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const authAtom = atom(false)

export const frequentlyCountries = [{ name: 'South Korea', code: 'KOR' }]
export const frequentlyUniversities = [
  { long_name: 'Sungkyunkwan University', university_id: 'skku' },
]

function isAuthenticated() {
  return localStorage.hasOwnProperty('user')
}

export function useAuth(): boolean {
  const [isAuth, setIsAuth] = useAtom(authAtom)

  useEffect(() => {
    setIsAuth(isAuthenticated())
  }, [typeof window !== 'undefined'])

  return isAuth
}

export function getUserData(): User {
  const encodedUser: string = localStorage.getItem('user') || ''
  return JSON.parse(atob(encodedUser))
}

export function useUniversities() {
  const [universities, setUniversities] = useState<University[]>()

  useEffect(() => {
    const base_url = process.env.base_url || 'http://localhost:8080/api'
    axios
      .get<University[]>(`${base_url}/universities`)
      .then((r) => setUniversities(r.data))
  }, [])

  return universities
}
