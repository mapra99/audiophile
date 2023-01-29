import * as AudiophileClient from '~/utils/audiophile-client'
import { AccessTokenSchema, VerificationStatusSchema } from './schema'

import type { UserInfoPayload, CodeInfoPayload } from './schema'

export const signUp = async (sessionId: string, userInfo: UserInfoPayload) => {
  return await AudiophileClient.sendRequest('post', 'auth/signup', {
    sessionToken: sessionId,
    body: userInfo
  })
}

export const login = async (sessionId: string, email: string) => {
  return await AudiophileClient.sendRequest('post', 'auth/login', {
    sessionToken: sessionId,
    body: { email }
  })
}

export const confirmCode = async(sessionId: string, codeInfo: CodeInfoPayload) => {
  const response = await AudiophileClient.sendRequest('post', 'auth/confirmation', {
    sessionToken: sessionId,
    body: codeInfo
  })

  const accessToken = AccessTokenSchema.parse(response);
  return accessToken
}

export const fetchVerificationStatus = async(sessionId: string, email: string) => {
  const response = await AudiophileClient.sendRequest('get', `auth/verification_status?email=${encodeURIComponent(email)}`, {
    sessionToken: sessionId
  })

  const verificationStatus = VerificationStatusSchema.parse(response);
  return verificationStatus
}
