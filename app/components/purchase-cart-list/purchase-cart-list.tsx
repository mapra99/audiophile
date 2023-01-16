import { Cross } from '~/icons'
import { Text, ButtonLink, Button, PurchaseCartListItem } from '~/components'
import formatCurrency from '~/utils/format-currency'

import type { PurchaseCartListProps } from './types'

const PurchaseCartList = ({ cart, onClose, onCartRemoval }: PurchaseCartListProps) => {
  const { items, uuid } = cart

  const subtotal = items.reduce((cumPrice, item) => item.price + cumPrice, 0)

  return (
    <div className="bg-white py-8 px-7 rounded-lg relative max-w-md mx-auto sm:ml-auto sm:mr-0">
      <button onClick={onClose} className="absolute right-7 top-8 w-4">
        <Cross />
      </button>

      <div className="mb-8">
        <Text variant="heading-6" className="mb-2">
          Cart ({items.length})
        </Text>

        <button
          className="text-base text-black opacity-50 underline"
          type="button"
          onClick={onCartRemoval}
        >
          Remove all
        </button>
      </div>

      <div className="flex flex-col gap-6 mb-8">
        { items.map(cartItem => (
          <PurchaseCartListItem
            key={cartItem.uuid}
            cartItem={cartItem}
          />
        ))}
      </div>

      <div className="flex justify-between mb-6 items-center">
        <Text variant="body" className="!font-medium opacity-50 uppercase" as="span">
          Subtotal
        </Text>

        <Text variant="heading-6" as="span">
          { formatCurrency(subtotal) }
        </Text>
      </div>

      <ButtonLink variant="primary" to={`/checkout?cart_uuid=${uuid}`} className="text-center mb-4" onClick={onClose}>
        Checkout
      </ButtonLink>

      <Button variant="secondary" type="button" className="text-center w-full" onClick={onClose}>
        Continue Shopping
      </Button>
    </div>
  )
}

export default PurchaseCartList
