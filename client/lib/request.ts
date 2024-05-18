import {
  type LoginFormSchema,
  type RegisterFormSchema,
} from '@/types/login-register'
import { type User } from '@/types/user'
import axios from 'axios'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api'

export async function fetchUser({ username, password }: LoginFormSchema) {
  return axios
    .get<User>(`${BASE_URL}/users`, {
      params: {
        username: username,
        pwd: password,
      },
    })
    .then((r) => r.data)
}

export async function createUser({
  username,
  password,
  nationality,
  home_university,
}: RegisterFormSchema) {
  return axios
    .post<User>(`${BASE_URL}/users`, null, {
      params: {
        username: username,
        pwd: password,
        nationality: nationality,
        home_university: home_university,
      },
    })
    .then((r) => r.data)
}
