import { Form, useActionData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { Text, TextInput, Button } from '~/components'
import { createLocation } from '~/models/location'
import formDataToObject from '~/utils/form-data-to-object'
import emptyObject from '~/utils/empty-object'
import { getAccessToken } from '~/utils/auth-storage'
import RequestError from '~/errors/request-error'

import type { ActionArgs } from '@remix-run/node'
import type { LocationPayload } from '~/models/location'

interface FormErrors {
  general?: string
  street_address?: string
  city?: string
  country?: string
  postal_code?: string
  extra_info?: string
}

const validateForm = (data: LocationPayload) => {
  const errors = {} as FormErrors

  const { street_address, postal_code, city, country } = data
  if (!street_address) errors.street_address = "Please add your street address"
  if (!postal_code) errors.postal_code = "Please add your ZIP Code"
  if (!city) errors.city = "Please add your city"
  if (!country) errors.country = "Please add your country"

  return errors
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const data = formDataToObject(formData)

  const errors = validateForm(data)
  if (!emptyObject(errors)) return json({ errors })

  const accessToken = await getAccessToken(request)
  invariant(accessToken, 'user must be authenticated')

  try {
    const location = await createLocation(accessToken, data)
    const url = new URL(request.url)
    const cartUuid = url.searchParams.get('cart_uuid')

    return redirect(`/checkout/shipping-info/confirmation?uuid=${location.uuid}&cart_uuid=${cartUuid}`)
  } catch (error) {
    if (!(error instanceof RequestError )) throw error
    errors.general = error.message

    return json({ errors })
  }
}

export default () => {
  const result = useActionData<typeof action>()
  const errors: FormErrors = result ? result.errors : {}

  return (
    <Form className="flex flex-col gap-6" method="post">
      <TextInput id="street_address" name="street_address" label="Your Address" placeholder="1137 Williams Avenue" error={errors.street_address} />
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="flex-1">
          <TextInput id="postal_code" name="postal_code" label="ZIP Code" placeholder="10001" error={errors.postal_code} />
        </div>
        <div className="flex-1">
          <TextInput id="city" name="city" label="City" placeholder="New York" error={errors.city} />
        </div>
      </div>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-4">
        <div className="flex-1">
          <TextInput id="country" name="country" label="Country" placeholder="United States" error={errors.country} />
        </div>
        <div className="flex-1">
          <TextInput id="extra_info" name="extra_info" label="Any Additional Details?" placeholder="Apt 102" error={errors.extra_info} />
        </div>
      </div>

      { errors.general && (
        <Text as="p" variant="body" className="text-danger !text-xs">
          { errors.general }
        </Text>
      )}

      <Button type="submit" variant="primary">Continue</Button>
    </Form>
  )
}
