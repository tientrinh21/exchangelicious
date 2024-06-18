import type { Review } from '@/types/review'
import type {
  LoginFormSchema,
  ProfileFormSchema,
  RegisterFormSchema,
  ReviewFormSchema,
  UniHeaderFormSchema,
  UniInfoFormSchema,
} from '@/types/schema'
import type { University, UniversityInfo } from '@/types/university'
import type { User } from '@/types/user'
import axios from 'axios'

const BASE_URL = process.env.BASE_URL || 'http://localhost:8080/api'

/* UNIVERSITY */
export async function fetchUniversities() {
  return axios.get<University[]>(`${BASE_URL}/universities`).then((r) => r.data)
}

export async function fetchUniversity(id: string) {
  return axios
    .get<University>(`${BASE_URL}/universities/${id}`)
    .then((r) => r.data)
    .catch((error) => error)
}

export async function fetchUniversityInfo(id: string) {
  return axios
    .get<UniversityInfo>(`${BASE_URL}/universities/info`, {
      params: {
        university_id: id,
      },
    })
    .then((r) => r.data)
}

export async function createUniversity(values: UniHeaderFormSchema) {
  return axios
    .post<University>(`${BASE_URL}/universities`, null, {
      params: values,
    })
    .then((r) => r.data)
}

export async function updateUniversity({
  id,
  values,
}: {
  id: string
  values: UniHeaderFormSchema
}) {
  return axios
    .patch<University>(`${BASE_URL}/universities`, null, {
      params: {
        university_id: id,
        ...values,
      },
    })
    .then((r) => r.data)
}

export async function updateUniversityInfo({
  id,
  values,
}: {
  id: string
  values: UniInfoFormSchema
}) {
  return axios
    .patch<University>(`${BASE_URL}/universities/info`, null, {
      params: {
        info_page_id: id,
        ...values,
      },
    })
    .then((r) => r.data)
}

/* REVIEW */
export async function createReview({
  user_id,
  university_id,
  values,
}: {
  user_id: string
  university_id: string
  values: ReviewFormSchema
}) {
  return axios
    .post<Review>(`${BASE_URL}/review`, {
      user_id,
      university_id,
      ...values,
    })
    .then((r) => r.data)
}

export async function updateReview({
  review_id,
  values,
}: {
  review_id: string
  values: ReviewFormSchema
}) {
  return axios
    .patch<Review>(
      `${BASE_URL}/review`,
      { ...values },
      { params: { review_id: review_id } },
    )
    .then((r) => r.data)
}

export async function deleteReview({ review_id }: { review_id: string }) {
  return axios
    .delete(`${BASE_URL}/review`, {
      params: {
        review_id: review_id,
      },
    })
    .then((r) => r.data)
}

export async function upvote({
  user_id,
  review,
}: {
  user_id: string
  review: Review
}) {
  if (review.has_upvoted)
    return axios
      .delete(`${BASE_URL}/review/upvote`, {
        params: {
          user_id: user_id,
          review_id: review.review_id,
        },
      })
      .then((r) => r.data)

  return axios
    .post(`${BASE_URL}/review/upvote`, null, {
      params: {
        user_id: user_id,
        review_id: review.review_id,
      },
    })
    .then((r) => r.data)
}

export async function downvote({
  user_id,
  review,
}: {
  user_id: string
  review: Review
}) {
  if (review.has_downvoted)
    return axios
      .delete(`${BASE_URL}/review/downvote`, {
        params: {
          user_id: user_id,
          review_id: review.review_id,
        },
      })
      .then((r) => r.data)

  return axios
    .post(`${BASE_URL}/review/downvote`, null, {
      params: {
        user_id: user_id,
        review_id: review.review_id,
      },
    })
    .then((r) => r.data)
}
/* USER */
export async function fetchUser({ username, password }: LoginFormSchema) {
  return axios
    .get<User>(`${BASE_URL}/users/login`, {
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

export async function updateUser(
  user: User,
  { password, nationality, home_university }: ProfileFormSchema,
) {
  return axios
    .patch<User>(`${BASE_URL}/users`, null, {
      params: {
        user_id: user.user_id,
        pwd: password,
        nationality: nationality,
        home_university: home_university,
      },
    })
    .then((r) => r.data)
}

export async function deleteUser(user: User) {
  return axios
    .delete(`${BASE_URL}/users`, {
      params: {
        user_id: user.user_id,
      },
    })
    .then((r) => r.data)
}

/* FAVORITES */
export async function addFavorite({
  user_id,
  university_id,
}: {
  user_id: string
  university_id: string
}) {
  return axios
    .post(`${BASE_URL}/favorites`, {
      user_id: user_id,
      university_id: university_id,
    })
    .then((r) => r.data)
}

export async function removeFavorite({ favorite_id }: { favorite_id: string }) {
  return axios
    .delete(`${BASE_URL}/favorites`, {
      params: {
        favorite_id: favorite_id,
      },
    })
    .then((r) => r.data)
}
