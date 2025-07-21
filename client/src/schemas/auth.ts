import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(1, 'identity is required'),
  email: z.string().min(1, 'email is required').email('invalid email address'),
  username: z.string().min(1, 'username is required'),
  password: z
    .string()
    .min(1, 'password is required')
    .min(5, { message: 'be at least 5 characters long' })
    .regex(/[a-zA-Z]/, { message: 'contain at least one letter.' })
    .regex(/[0-9]/, { message: 'contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'contain at least one special character.',
    })
    .trim(),
})

export const loginSchema = z.object({
  identity: z.string().min(1, 'Please input your username or email address'),
  password: z.string().min(1, 'password is required'),
})

export const emailVerificationSchema = z.object({
  code: z.string().min(1, 'code is required'),
})
