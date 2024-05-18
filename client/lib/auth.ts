import { type User } from '@/types/user'
import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

export const authAtom = atom(false)

function isAuthenticated() {
  return localStorage.hasOwnProperty('user')
}

export function useAuth(): boolean {
  const [isAuth, setIsAuth] = useAtom(authAtom)

  useEffect(() => {
    function handleChangeStorage() {
      setIsAuth(isAuthenticated())
    }

    window.addEventListener('storage', handleChangeStorage)
    return () => window.removeEventListener('storage', handleChangeStorage)
  }, [])

  return isAuth
}

export function getUserData(): User {
  const encodedUser: string = localStorage.getItem('user') || ''
  return JSON.parse(atob(encodedUser))
}
