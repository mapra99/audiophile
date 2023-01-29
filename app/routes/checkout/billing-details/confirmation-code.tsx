import { Form, useActionData, useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { Button, Text, TextInput, VerificationStatusMessage } from '~/components'
import formDataToObject from '~/utils/form-data-to-object'
import { getOrCreateSessionId } from '~/utils/session-storage'
import { persistAccessToken } from '~/utils/auth-storage'
import RequestError from '~/errors/request-error'
import { confirmCode, fetchVerificationStatus } from '~/models/auth'

import type { ActionArgs, LoaderArgs } from '@remix-run/node'
import type { CodeInfoPayload } from '~/models/auth'

export const loader = async({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const email = url.searchParams.get('email')
  invariant(email, 'Email must be present')

  const { sessionId } = await getOrCreateSessionId(request)
  invariant(sessionId, 'Session must be present')

  const codeStatus = await fetchVerificationStatus(sessionId, email)
  return json({ ...codeStatus })
}

interface ValidationErrors {
  code?: string
  email?: string
  general?: string
}

const validateForm = (codeInfo: CodeInfoPayload) => {
  const errors: ValidationErrors = {}
  if (!codeInfo.email) errors.email = 'Please enter your email'
  if (!codeInfo.code) errors.code = 'Please enter your code'

  return errors
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData()
  const { code } = formDataToObject(formData)

  const url = new URL(request.url);
  const email = url.searchParams.get("email");
  invariant(email, 'Email must be present')

  const { sessionId } = await getOrCreateSessionId(request)

  const errors = validateForm({ code, email })
  if (Object.keys(errors).length) return json({ errors })

  try {
    const tokenData = await confirmCode(sessionId, { email, code })
    const headers = await persistAccessToken({
      request,
      accessToken: tokenData.access_token
    })

    const cartUuid = url.searchParams.get('cart_uuid')

    return redirect(`/checkout?cart_uuid=${cartUuid}`, { headers })
  } catch (error) {
    if (!(error instanceof RequestError)) throw error

    errors.general = error.message
    return json({ errors })
  }
}


export default () => {
  const result = useActionData<typeof action>()
  const errors: ValidationErrors = result ? result.errors : {}

  const { started_code, expires_at } = useLoaderData<typeof loader>()

  return (
    <div>
      <Text as="h3" variant="subtitle" className="mb-4">
        Verification Code
      </Text>

      <Form className="flex flex-col gap-6" method="post">
        <Text as="p" variant="body">
          We just sent you a verification code to your email. Please enter it below
        </Text>
        <TextInput id="code" name="code" placeholder="123456" error={errors.code} type="tel" />
        { errors.general && (
          <Text as="p" variant="body" className="text-danger !text-xs">
            { errors.general }
          </Text>
        )}

        <VerificationStatusMessage
          startedCode={started_code}
          expiresAt={expires_at}
        />

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </div>
  )
}
