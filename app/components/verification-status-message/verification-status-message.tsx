import { Text } from '~/components'
import useCountdown from '~/hooks/use-countdown'
import goBack from '~/utils/go-back'

import type { VerificationStatusMessageProps } from './types'

const VerificationStatusMessage = ({ startedCode, expiresAt }: VerificationStatusMessageProps) => {
  const { minutes, seconds } = useCountdown({ target: expiresAt || new Date() })
  const expiredCode = !startedCode || !expiresAt || ( minutes === 0 && seconds === 0 )

  if (expiredCode) return (
    <Text variant="body" as="p" className="text-danger">
      Your code has expired.
      {' '}
      <button type="button" className="text-orange underline hover:cursor-pointer inline-block text-left p-0" onClick={goBack}>
        Resend code
      </button>
    </Text>
  )

  return (
    <Text variant="body" as="p">
      The code will be valid for the next { minutes } minutes, { seconds } seconds.
    </Text>
  )
}

export default VerificationStatusMessage
