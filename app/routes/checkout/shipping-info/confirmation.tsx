import { useLoaderData, Form } from "@remix-run/react"
import { json, redirect } from '@remix-run/node'
import invariant from "tiny-invariant"
import { Text, Button, LocationInfo } from '~/components'
import useMap from '~/hooks/use-map'
import { getAccessToken } from '~/utils/auth-storage'
import { getSessionId } from "~/utils/session-storage"
import { getLocation, deleteLocation } from '~/models/location'
import { getLastStartedCart, updateCartLocation } from '~/models/purchase-cart'

import type { LoaderArgs, LinksFunction } from "@remix-run/node"

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href:'https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css' }]
}

export const loader = async ({ request }: LoaderArgs) => {
  const MAPBOX_GL_TOKEN = process.env.MAPBOX_GL_TOKEN
  invariant(MAPBOX_GL_TOKEN, 'MAPBOX_GL_TOKEN must be defined')

  const url = new URL(request.url)
  const locationUuid = url.searchParams.get('uuid')
  invariant(locationUuid, 'uuid must be present in URL')

  const accessToken = await getAccessToken(request)
  invariant(accessToken, 'user must be authenticated')

  const location = await getLocation(accessToken, locationUuid)
  return json({ location, mapboxToken: MAPBOX_GL_TOKEN })
}

export const action = async({ request }: LoaderArgs) => {
  const { method } = request

  const url = new URL(request.url)
  const locationUuid = url.searchParams.get('uuid')
  invariant(locationUuid, 'uuid must be present in URL')

  const cartUuid = url.searchParams.get('cart_uuid')

  if (method === 'POST') {
    const sessionId = await getSessionId(request);
    invariant(sessionId, 'sessionId must exist')

    const activeCart = await getLastStartedCart(sessionId)
    invariant(activeCart, 'there must be an active started cart')

    await updateCartLocation(sessionId, activeCart.uuid, locationUuid)

    return redirect(`/checkout?cart_uuid=${cartUuid}`)
  } else if (method === 'DELETE') {
    const accessToken = await getAccessToken(request)
    invariant(accessToken, 'user must be authenticated')

    await deleteLocation(accessToken, locationUuid)

    return redirect(`/checkout/shipping-info?cart_uuid=${cartUuid}`)
  }

  return null
}

export default () => {
  const { location, mapboxToken } = useLoaderData<typeof loader>()

  const lng = parseFloat(location.longitude)
  const lat = parseFloat(location.latitude)
  useMap({
    containerId: 'map',
    center: [lng, lat],
    marker: { position: [lng,lat] },
    mapboxToken
  })

  return (
    <div>
      <div className="flex justify-between gap-6">
        <Text variant="body" className="!font-bold mb-6">
          Did we get it right?
        </Text>

        
        <div className="mb-4 text-right">
          <LocationInfo location={location} />
        </div>
      </div>

      <div id="map" className="w-full h-96 mb-6" />

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        <Form className="flex-1" method="post">
          <Button type="submit" variant="primary" className="w-full">
            Yes, It's correct
          </Button>
        </Form>

        <Form className="flex-1" method="delete">
          <Button type="submit" variant="secondary" className="w-full">
            No, Edit Address
          </Button>
        </Form>
      </div>
    </div>
  )
}
