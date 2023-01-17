import { Outlet, useLoaderData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { Text, PurchaseCartSummary, ProgressBar } from '~/components'
import { getCartDetails } from '~/models/purchase-cart'
import { getSessionId } from '~/utils/session-storage'
import { getAccessToken } from '~/utils/auth-storage'
import goBack from '~/utils/go-back'

import type { LoaderArgs } from '@remix-run/node'

export const loader = async ({ request }: LoaderArgs) => {
  const sessionId = await getSessionId(request)
  invariant(sessionId, 'sessionId must exist')

  const url = new URL(request.url)
  const cartUuid = url.searchParams.get('cart_uuid')
  invariant(cartUuid, 'cart_uuid param must be present')

  const cart = await getCartDetails(sessionId, cartUuid)

  const paymentIntent = url.searchParams.get('payment_intent')
  const paymentUuid = url.searchParams.get('payment_uuid')

  // checkout flow navigation
  let progress = "0";
  const accessToken = await getAccessToken(request)
  if(!accessToken) {
    progress = "25%"
    if (url.pathname === '/checkout') return redirect(`/checkout/billing-details?cart_uuid=${cartUuid}`)
  } else if (!cart.user_location_uuid) {
    progress = "50%"
    if (url.pathname === '/checkout') return redirect(`/checkout/shipping-info?cart_uuid=${cartUuid}`)
  } else if (!paymentIntent || !paymentUuid) {
    progress = "75%"
    if (url.pathname === '/checkout') return redirect(`/checkout/payment?cart_uuid=${cartUuid}`)
  } else {
    progress = '100%'

    if (url.pathname === '/checkout') {
      const redirectStatus = url.searchParams.get('redirect_status')

      if (redirectStatus === 'succeeded') {
        return redirect(`/checkout/thank-you?cart_uuid=${cartUuid}&payment_uuid=${paymentUuid}&payment_intent=${paymentIntent}`)
      } else {
        return redirect(`/checkout/payment-failed?cart_uuid=${cartUuid}&payment_uuid=${paymentUuid}&payment_intent=${paymentIntent}`)
      }
    }
  }

  return json({ cart, progress })
}

export default () => {
  const { cart, progress } = useLoaderData<typeof loader>()

  const handleGoBack = () => {
    if (progress === "100%") return window.location.href = "/"

    goBack();
  }

  return (
    <div className="bg-gray">
      <div className="pt-4 pb-6 px-6 sm:pt-12 sm:px-10">
        <div className="max-w-6xl mx-auto">
          <button onClick={handleGoBack} className="text-base text-black opacity-50 hover:opacity-100 transition">
            Go Back
          </button>
        </div>
      </div>

      <div className="px-6 pb-24 sm:px-10 sm:pb-28">
        <div className="max-w-6xl mx-auto flex flex-col gap-8 lg:flex-row">
          <div className="rounded-lg bg-white px-6 py-8 sm:p-8 lg:flex-1 lg:pt-14 lg:px-12 lg:pb-12 relative">
            <div className="absolute top-0 left-0 w-full">
              <ProgressBar progress={progress} />
            </div>

            <Text variant="heading-3" className="!text-3xl sm:!text-4xl mb-8 sm:mb-10" as="h2">
              Checkout
            </Text>

            <Outlet />
          </div>

          <div className="lg:flex-0.5">
            <PurchaseCartSummary cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}
