import { useLoaderData, Form, Link, useActionData } from "@remix-run/react"
import { json, redirect } from '@remix-run/node'
import invariant from "tiny-invariant"
import { Text, RadioInput, LocationInfo, Button } from '~/components'
import { getAllLocations } from '~/models/location'
import { getLastStartedCart, updateCartLocation } from '~/models/purchase-cart'
import { getAccessToken } from "~/utils/auth-storage"
import { getSessionId } from '~/utils/session-storage'
import formDataToObject from "~/utils/form-data-to-object"
import emptyObject from "~/utils/empty-object"

import type { LoaderArgs, ActionArgs } from "@remix-run/node"

interface ValidationErrors {
  location_uuid?: string
}

interface FormDataArgs {
  location_uuid: string
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const cartUuid = url.searchParams.get('cart_uuid')

  const accessToken = await getAccessToken(request);
  invariant(accessToken, 'user is not authenticated')

  const locations = await getAllLocations(accessToken)
  if (!locations.length) return redirect(`/checkout/shipping-info/new-location?cart_uuid=${cartUuid}`)

  return json({ locations, cartUuid })
}

const validateForm = ({ location_uuid }: FormDataArgs) => {
  const errors = {} as ValidationErrors
  if (!location_uuid) errors.location_uuid = 'Please pick one address'

  return errors
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = formDataToObject(formData)

  const errors = validateForm(data)
  if (!emptyObject(errors)) return json({ errors })

  const sessionId = await getSessionId(request)
  invariant(sessionId, 'sessionId must exist')

  const activeCart = await getLastStartedCart(sessionId)
  invariant(activeCart, 'there must be an active started cart')

  await updateCartLocation(sessionId, activeCart.uuid, data.location_uuid)

  const url = new URL(request.url)
  const cartUuid = url.searchParams.get('cart_uuid')

  return redirect(`/checkout?cart_uuid=${cartUuid}`)
}

export default () => {
  const { locations, cartUuid } = useLoaderData<typeof loader>()
  const result = useActionData<typeof action>()

  const errors: ValidationErrors = result ? result.errors : {}

  return (
    <div>
      <Text variant="body" className="!font-bold mb-6">
        Choose one location to send your order
      </Text>

      <Form method="post" className="flex flex-col gap-4">
        { locations.map(location => (
          <RadioInput
            key={location.uuid}
            id={`location-uuid--${location.uuid}`}
            name="location_uuid"
            value={location.uuid}
            label={<LocationInfo location={location} />}
          />
        ))}

        { errors.location_uuid && (
          <Text variant="body" className="!text-danger">
            { errors.location_uuid }
          </Text>
        ) }

        <Link to={`/checkout/shipping-info/new-location?cart_uuid=${cartUuid}`} className="text-orange underline">
          Add new address
        </Link>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </div>
  )
}
