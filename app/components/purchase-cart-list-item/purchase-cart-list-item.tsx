import { useContext, useState } from 'react'
import { Text, QuantityInput } from '~/components'
import { TrashCan } from '~/icons'
import { PurchaseCartContext } from '~/contexts/purchase-cart-context'
import formatCurrency from '~/utils/format-currency'

import type { PurchaseCartListItemProps } from './types'

const PurchaseCartListItem = ({ cartItem }: PurchaseCartListItemProps) => {
  const { createOrUpdateCart, removeCartItem } = useContext(PurchaseCartContext)
  const { uuid, stock: { uuid: stockUuid, product, quantity: stockQuantity }, unit_price, quantity } = cartItem
  const [reachedMaxQuantity, setReachedMaxQuantity] = useState<boolean>(false)

  const handleItemChange = async (qty: number) => {
    setReachedMaxQuantity(quantity === qty && quantity === stockQuantity)

    await createOrUpdateCart({
      stock_uuid: stockUuid,
      quantity: qty
    })
  }

  return (
    <div>
      <div key={uuid} className="flex gap-4 items-center">
        <div className="rounded-lg bg-gray w-20 sm:w-16 h-20 sm:h-16 flex items-center justify-center flex-none">
          { product.image && (
            <img src={product.image.url} alt="" className="block w-12 sm:w-9" />
          ) }
        </div>

        <div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-0 sm:justify-between">
          <div className="flex flex-wrap flex-1 justify-end gap-x-2 sm:gap-x-0 sm:justify-start sm:flex-col sm:flex-nowrap">
            <Text variant="body" className="!font-bold text-ellipsis overflow-hidden" as="span">
              { product.name }
            </Text>
            <Text variant="body" className="!font-bold text-black opacity-50 text-ellipsis overflow-hidden" as="span">
              { formatCurrency(unit_price) }
            </Text>
          </div>

          <div className="flex gap-4 justify-end w-full sm:w-auto sm:items-center">
            { quantity === 1 ? (
              <button
                className="bg-gray h-12 w-12 flex items-center justify-center hover:opacity-70 transition-all"
                onClick={() => removeCartItem(uuid)}
                type="button"
              >
                <TrashCan className="h-4" />
              </button>
            ) : (
              <div className="h-12 w-12 sm:hidden" />
            )}

            <div className="flex-none">
              <QuantityInput value={quantity} onChange={handleItemChange} min={1} max={stockQuantity} />
            </div>
          </div>
        </div>
      </div>

      { reachedMaxQuantity && (
        <Text variant="body" className="!text-danger !leading-none text-right italic">
          There are only { stockQuantity } units available
        </Text>
      )}
    </div>
  )
}

export default PurchaseCartListItem
