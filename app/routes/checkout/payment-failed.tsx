import { Text, ButtonLink } from '~/components'

export default () => {
  return (
    <div>
      <Text variant="heading-4" className="mb-6">
        Sorry, there was an issue with your payment. Please try again later
      </Text>

      <ButtonLink to="/" variant="primary" className='text-center'>
        Go Home
      </ButtonLink>
    </div>
  )
}
