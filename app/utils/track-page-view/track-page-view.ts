import invariant from 'tiny-invariant'
import { createPageView } from '~/models/page-view'
import { getOrCreateSessionId } from '~/utils/session-storage'

const trackPageView = async (request: Request, url: string) => {
  const { sessionId } = await getOrCreateSessionId(request)
  invariant(sessionId, 'sessionId must exist')

  createPageView(sessionId, url)
}

export default trackPageView
