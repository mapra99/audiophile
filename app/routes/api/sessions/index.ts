import { getOrCreateSessionId } from '~/utils/session-storage'
import trackPageView from '~/utils/track-page-view'

import type { ActionArgs } from '@remix-run/node'

export const action = async ({ request }: ActionArgs) => {
  const { headers } = await getOrCreateSessionId(request)
  const { url } = await request.json()
  await trackPageView(request, url)

  return new Response('ok', {
    status: 204,
    headers
  })
}
