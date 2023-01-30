import { useEffect } from 'react'
import invariant from 'tiny-invariant'
import { maskInput } from 'vanilla-text-mask'

import type { UseMaskedInputArgs } from './types'

const MASK_TYPES_MAPPINGS = {
  phone: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]
}

const useMaskedInput = ({ selector, type }: UseMaskedInputArgs) => {
  const typeMask = MASK_TYPES_MAPPINGS[type]

  useEffect(() => {
    const inputElement = document.querySelector(selector)
    invariant(inputElement, 'input element not found')
    invariant(typeMask, 'mask is not defined')

    maskInput({
      inputElement,
      mask: typeMask
    })
  }, [selector, typeMask])
}

export default useMaskedInput
