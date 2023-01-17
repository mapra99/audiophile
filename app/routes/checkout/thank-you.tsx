import invariant from 'tiny-invariant'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Text, ButtonLink, PurchaseCartSummaryItem } from '~/components'
import { Check } from '~/icons'
import { getCartDetails } from '~/models/purchase-cart'
import { getPayment } from '~/models/payment'
import { getSessionId } from '~/utils/session-storage'
import { getAccessToken } from '~/utils/auth-storage'
import formatCurrency from '~/utils/format-currency'

import type { LoaderArgs } from "@remix-run/node"

export const loader = async ({ request }: LoaderArgs) => {
  const sessionId = await getSessionId(request)
  invariant(sessionId, 'session must exist')

  const accessToken = await getAccessToken(request)
  invariant(accessToken, 'user must be authenticated')

  const url = new URL(request.url)
  const cartUuid = url.searchParams.get('cart_uuid')
  invariant(cartUuid, 'cart_uuid param must be present')

  const cart = await getCartDetails(sessionId, cartUuid)
  invariant(cart, 'cart must exist')

  const paymentUuid = url.searchParams.get('payment_uuid')
  invariant(paymentUuid, 'payment_uuid param must be present')

  const payment = await getPayment(accessToken, paymentUuid)
  invariant(payment, 'payment must exist')

  return json({ cart, payment })
}

export default () => {
  const { cart, payment } = useLoaderData<typeof loader>()

  const { items } = cart
  const { amount } = payment
  const formattedAmount = formatCurrency(amount)

  return (
    <div>
      <div className="bg-orange w-16 h-16 flex items-center justify-center rounded-full p-5 mb-6 sm:mb-8">
        <Check className="[&>path]:stroke-white"/>
      </div>

      <Text variant="heading-5" className="mb-4" as="h3">
        Thank you for your order
      </Text>

      <Text variant="body" className="mb-6 opacity-50 sm:mb-8">
        You will receive an email confirmation shortly
      </Text>

      <div className="mb-6 flex flex-col sm:flex-row w-full sm:mb-12">
        <div className="bg-gray rounded-tl-lg rounded-tr-lg p-6 flex-1 sm:rounded-tr-none sm:rounded-bl-lg">
          <PurchaseCartSummaryItem cartItem={items[0]} />

          { items.length > 1 && (
            <>
              <hr className="my-3 opacity-10" />
              <Text variant="body" as="span" className="!font-bold opacity-50 block text-center">
                and { items.length - 1 } other item(s)
              </Text>
            </>
          )}
        </div>
        <div className="bg-black px-6 py-4 rounded-bl-lg rounded-br-lg flex-0.5 sm:rounded-bl-none sm:rounded-tr-lg flex flex-col justify-center">
          <Text variant="body" as="span" className="block !text-white opacity-50 mb-2 uppercase">
            Grand Total
          </Text>

          <Text variant="heading-6" as="span" className="!font-bold !text-white">
            { formattedAmount }
          </Text>
        </div>
      </div>

      <ButtonLink variant="primary" to="/" className="text-center">
        Back To Home
      </ButtonLink>
    </div>
  )
}
