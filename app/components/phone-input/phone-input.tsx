import { useState } from 'react'
import countryCodes from 'country-calling-code'

import type { ChangeEvent } from 'react'
import type { PhoneInputProps } from './types'

const PhoneInput = ({label, id, name, className, error, ...props}: PhoneInputProps) => {
  let inputStyles = 'px-6 py-4.5 border-2 border-gray text-sm placehodlder:text-gray font-bold rounded-lg focus:border-orange focus:outline-orange focus:caret-orange '
  if (error) inputStyles += 'border-danger'

  const [phone, setPhone] = useState<string | undefined>()
  const [countryCode, setCountryCode] = useState<string | undefined>()
  const [baseNumber, setBaseNumber] = useState<string | undefined>()

  const updateCountryCode = (event: ChangeEvent<HTMLSelectElement>) => {
    console.log("HOLI")
    const { value } = event.target
    setCountryCode(value)
    setPhone(`+${value} ${baseNumber}`)
  }

  const updateBaseNumber = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    let formattedValue = value
    if (formattedValue.length === 3) formattedValue += '-'
    if (formattedValue.length === 7) formattedValue += '-'
    if (formattedValue.length === 13 && baseNumber) formattedValue = baseNumber

    setBaseNumber(formattedValue)
    setPhone(`+${countryCode} ${formattedValue}`)
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between mb-2.5">
        { label && (
          <label htmlFor={id} className={`text-xs font-bold leading-4 ${error ? 'text-danger' : ''}`}>
            { label }
          </label>
        )}

        { error && (
          <span className="text-xs font-medium leading-4 text-danger">
            { error }
          </span>
        )}
      </div>

      <input type="hidden" name={name} value={phone} />

      <div className="w-full flex gap-4 flex-wrap">
        <select
          name={`${name}_country_code`}
          className={`max-w-full overflow-ellipsis ${inputStyles}`}
          onChange={updateCountryCode}
        >
          <option value="">Select a Country</option>
          { countryCodes.map(code => (
            <option key={code.isoCode2} value={code.countryCodes[0]}>
              { code.country } (+{code.countryCodes[0]})
            </option>
          )) }
        </select>

        <input
          {...props}
          id = {id}
          name={`${name}_base_number`}
          className={`flex-1 ${inputStyles} ${className || ''}`}
          placeholder="202-555-0136"
          onChange={updateBaseNumber}
          value={baseNumber}
        />
      </div>
    </div>
  )
}

export default PhoneInput
