import invariant from 'tiny-invariant'
import { getSessionId } from '~/utils/session-storage'
import { login } from '~/models/auth'

import type { ActionArgs } from '@remix-run/node'

export const action = async ({ request }: ActionArgs) => {
  const sessionId = await getSessionId(request)
  invariant(sessionId, 'sessionId not found')

  const { email } = await request.json()
  invariant(email, 'Email must be present')

  await login(sessionId, email)
  return new Response('ok', { status: 200 })
}
