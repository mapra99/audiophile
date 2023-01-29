import { z } from 'zod'

export interface UserInfoPayload {
  name: string
  email: string
  phone: string
}

export interface CodeInfoPayload {
  email: string
  code: string
}

export const AccessTokenSchema = z.object({
  access_token: z.string(),
  expires_at: z.string()
})

export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const VerificationStatusSchema = z.object({
  started_code: z.boolean(),
  expires_at: z.string().nullable()
})

export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;
