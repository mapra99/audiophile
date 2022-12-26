import { Form, Link, useActionData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { Button, Text, TextInput } from '~/components'
import formDataToObject from '~/utils/form-data-to-object'
import { getOrCreateSessionId } from '~/utils/session-storage'
import RequestError from '~/errors/request-error'
import { login } from '~/models/auth'
import trackPageView from '~/utils/track-page-view'

import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import type { UserInfoPayload } from '~/models/auth'

interface ValidationErrors {
  general?: string
  email?: string
}

const validateForm = (userInfo: UserInfoPayload) => {
  const errors: ValidationErrors = {}
  if (!userInfo.email) errors.email = 'Please enter your email'

  return errors
}

export const loader = async ({ request }: LoaderArgs) => {
  trackPageView(request)
  return null;
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const userInfo = formDataToObject(formData) as UserInfoPayload
  const { sessionId } = await getOrCreateSessionId(request)

  const errors = validateForm(userInfo)
  if (Object.keys(errors).length) return json({ errors })

  try {
    await login(sessionId, userInfo.email)
  } catch (error) {
    if (!(error instanceof RequestError)) throw error
    errors.general = error.message
  }

  if (Object.keys(errors).length) return json({ errors })

  return redirect(`/checkout/confirmation-code?email=${encodeURIComponent(userInfo.email)}`)
}


export default () => {
  const result = useActionData<typeof action>()
  const errors: ValidationErrors = result ? result.errors : {}

  return (
    <div>
      <Text as="h3" variant="subtitle" className="mb-4">
        Login
      </Text>

      <Form className="flex flex-col gap-6" method="post">
        <TextInput label="Email Address" id="email" name="email" placeholder="email@example.com" type="email" error={errors.email} />
        { errors.general && (
          <Text as="p" variant="body" className="text-danger !text-xs">
            { errors.general }
          </Text>
        )}

        <Text variant="body" as="p">
          Not a user yet? <Link to="/checkout/billing-details" className="text-orange underline hover:cursor-pointer">Register here</Link>
        </Text>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </div>
  )
}
