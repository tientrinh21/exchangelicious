import { z } from 'zod'

// LOGIN
export const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be 2 or more characters long' })
    .max(50),
  password: z
    .string()
    .min(2, { message: 'Password must be 2 or more characters long' })
    .max(50),
})

export type LoginFormSchema = z.infer<typeof loginFormSchema>

// REGISTER
export const registerFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be 2 or more characters long' })
    .max(50),
  password: z
    .string()
    .min(2, { message: 'Password must be 2 or more characters long' })
    .max(50),
  nationality: z.string().optional(),
  home_university: z.string().optional(),
})

export type RegisterFormSchema = z.infer<typeof registerFormSchema>

// UPDATE PROFILE
export const profileFormSchema = z.object({
  password: z
    .string()
    .min(2, { message: 'Password must be 2 or more characters long' })
    .max(50),
  nationality: z.string().optional(),
  home_university: z.string().optional(),
})

export type ProfileFormSchema = z.infer<typeof registerFormSchema>
