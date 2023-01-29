import { PurchaseCartList, EmptyPurchaseCartList } from '~/components'

import type { PurchaseCartModalProps } from "./types"

const PurchaseCartModal = ({ cart, onClose, onCartRemoval }: PurchaseCartModalProps) => {
  return (
    <div className="z-50 fixed top-0 left-0 right-0 bottom-0">
      <div className="relative h-full w-full p-6 sm:px-10">
        <div className="absolute top-0 left-0 w-full h-full -z-10 bg-black opacity-40"/>
        <div className="max-w-6xl mx-auto mt-20 max-h-full overflow-y-auto pb-20 box-border">
          { cart ? (
            <PurchaseCartList
              cart={cart}
              onClose={onClose}
              onCartRemoval={onCartRemoval}
            />
          ) : (
            <EmptyPurchaseCartList onClose={onClose} />
          ) }
        </div>
      </div>
    </div>
  )
}

export default PurchaseCartModal
